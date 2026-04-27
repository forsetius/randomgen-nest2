/**
 * Run the application pre-push pipeline with a compact terminal dashboard.
 *
 * The script runs formatting first because it can modify source files. When
 * formatting succeeds, independent checks run in parallel and serial e2e tests
 * run after the parallel e2e suite to avoid sharing e2e server metadata.
 */
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import os from 'node:os';
import { performance } from 'node:perf_hooks';
import path from 'node:path';
import readline from 'node:readline';

type Status = 'WAITING' | 'RUNNING' | 'OK' | 'WARN' | 'ERROR' | 'SKIPPED';
type StageKey = 'format' | 'unit' | 'e2eParallel' | 'e2eSerial' | 'build';

interface StageState {
  name: string;
  status: Status;
  failed: string[];
  warned: string[];
  currentTask?: string | undefined;
  startedAt?: number | undefined;
  finishedAt?: number | undefined;
}

interface ScriptExecutionResult {
  code: number;
  hasWarnings: boolean;
}

type StageMap = Record<StageKey, StageState>;

const COLOR = {
  green: '\u001B[32m',
  yellow: '\u001B[33m',
  red: '\u001B[31m',
  magenta: '\u001B[35m',
  white: '\u001B[97m',
  lightGray: '\u001B[37m',
  bold: '\u001B[1m',
  unbold: '\u001B[22m',
  reset: '\u001B[0m',
} as const;

const STATUS_COLOR: Record<Status, string> = {
  WAITING: COLOR.lightGray,
  RUNNING: COLOR.white,
  OK: COLOR.green,
  WARN: COLOR.yellow,
  ERROR: COLOR.red,
  SKIPPED: COLOR.magenta,
};

const stageOrder: readonly StageKey[] = [
  'format',
  'unit',
  'e2eParallel',
  'e2eSerial',
  'build',
];
const applicationRoot = path.resolve(__dirname, '..');
const npmCacheDir = path.join(os.tmpdir(), 'randomgen-npm-cache');
const ENTER_ALTERNATE_SCREEN = '\u001B[?1049h';
const EXIT_ALTERNATE_SCREEN = '\u001B[?1049l';

class Dashboard {
  private readonly useDynamicRedraw = shouldUseDynamicDashboard();
  private readonly handleProcessExit = (): void => {
    this.teardownDynamicSession();
  };
  private lastNonInteractiveSnapshot = '';
  private pendingDynamicSnapshot?: string | undefined;
  private isDynamicRenderScheduled = false;
  private isClosed = false;

  public constructor() {
    if (!this.useDynamicRedraw) {
      return;
    }

    process.stdout.write(ENTER_ALTERNATE_SCREEN);
    process.once('exit', this.handleProcessExit);
  }

  public render(stages: StageMap): void {
    if (this.useDynamicRedraw) {
      this.scheduleDynamicRender(stages);
      return;
    }

    this.renderNonInteractive(stages);
  }

  public done(stages: StageMap): void {
    if (!this.useDynamicRedraw) {
      return;
    }

    const snapshot = this.buildLines(stages, false).join('\n');
    this.pendingDynamicSnapshot = undefined;
    this.teardownDynamicSession();
    process.stdout.write(`${snapshot}\n`);
  }

  public abort(): void {
    this.pendingDynamicSnapshot = undefined;
    this.teardownDynamicSession();
  }

  private scheduleDynamicRender(stages: StageMap): void {
    this.pendingDynamicSnapshot = this.buildLines(stages, true).join('\n');

    if (this.isDynamicRenderScheduled || this.isClosed) {
      return;
    }

    this.isDynamicRenderScheduled = true;

    setImmediate(() => {
      this.isDynamicRenderScheduled = false;

      if (this.isClosed || this.pendingDynamicSnapshot === undefined) {
        return;
      }

      this.renderDynamic(this.pendingDynamicSnapshot);
      this.pendingDynamicSnapshot = undefined;
    });
  }

  private renderDynamic(snapshot: string): void {
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    process.stdout.write(snapshot);
  }

  private renderNonInteractive(stages: StageMap): void {
    const lines = this.buildLines(stages, false);
    const snapshot = lines.join('\n');

    if (snapshot !== this.lastNonInteractiveSnapshot) {
      process.stdout.write(`${snapshot}\n`);
      this.lastNonInteractiveSnapshot = snapshot;
    }
  }

  private buildLines(
    stages: StageMap,
    includeRunningDetails: boolean,
  ): string[] {
    const lines: string[] = [];

    for (const key of stageOrder) {
      lines.push(...this.buildStageLines(stages[key], includeRunningDetails));
    }

    return lines;
  }

  private buildStageLines(
    stage: StageState,
    includeRunningDetails: boolean,
  ): string[] {
    const lines = [
      `${formatStatus(stage.status)} ${formatStageLabel(stage, includeRunningDetails)}`,
    ];

    if (stage.status === 'ERROR') {
      for (const failed of stage.failed) {
        lines.push(`  x ${failed}`);
      }
    }

    if (stage.status === 'WARN') {
      for (const warned of stage.warned) {
        lines.push(`  ! ${warned}`);
      }
    }

    return lines;
  }

  private teardownDynamicSession(): void {
    if (!this.useDynamicRedraw || this.isClosed) {
      return;
    }

    this.isClosed = true;
    process.removeListener('exit', this.handleProcessExit);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    process.stdout.write(EXIT_ALTERNATE_SCREEN);
  }
}

async function runPrePush(): Promise<number> {
  await mkdir(npmCacheDir, { recursive: true });

  const dashboard = new Dashboard();
  const stages = createInitialStages();

  try {
    dashboard.render(stages);

    await executeStage(stages.format, 'format', dashboard, stages);

    if (stages.format.status !== 'OK') {
      markStagesAsSkipped(stages, [
        'unit',
        'e2eParallel',
        'e2eSerial',
        'build',
      ]);
      dashboard.render(stages);
      return finishDashboard(dashboard, stages);
    }

    await Promise.all([
      executeStage(stages.unit, 'test:unit', dashboard, stages),
      executeStage(stages.e2eParallel, 'test:e2e:parallel', dashboard, stages),
      executeStage(stages.build, 'build', dashboard, stages),
    ]);
    await executeStage(stages.e2eSerial, 'test:e2e:serial', dashboard, stages);

    return finishDashboard(dashboard, stages);
  } catch (error: unknown) {
    dashboard.abort();
    throw error;
  }
}

function finishDashboard(dashboard: Dashboard, stages: StageMap): number {
  dashboard.done(stages);
  return hasProblems(stages) ? 1 : 0;
}

function createInitialStages(): StageMap {
  return {
    format: { name: 'Format', status: 'WAITING', failed: [], warned: [] },
    unit: { name: 'Unit Tests', status: 'WAITING', failed: [], warned: [] },
    e2eParallel: {
      name: 'E2E Parallel',
      status: 'WAITING',
      failed: [],
      warned: [],
    },
    e2eSerial: {
      name: 'E2E Serial',
      status: 'WAITING',
      failed: [],
      warned: [],
    },
    build: { name: 'Build', status: 'WAITING', failed: [], warned: [] },
  };
}

function hasProblems(stages: StageMap): boolean {
  return stageOrder.some((key) => {
    const status = stages[key].status;
    return status === 'ERROR' || status === 'WARN';
  });
}

function markStagesAsSkipped(stages: StageMap, keys: StageKey[]): void {
  for (const key of keys) {
    const stage = stages[key];

    if (stage.status === 'WAITING') {
      stage.status = 'SKIPPED';
      stage.currentTask = undefined;
    }
  }
}

async function executeStage(
  stage: StageState,
  script: string,
  dashboard: Dashboard,
  stages: StageMap,
): Promise<void> {
  stage.status = 'RUNNING';
  stage.startedAt = performance.now();
  stage.finishedAt = undefined;
  stage.currentTask = formatScriptLabel(script);
  dashboard.render(stages);

  try {
    const result = await runNpmScript(script);

    stage.failed = result.code === 0 ? [] : [formatScriptLabel(script)];
    stage.warned = result.hasWarnings ? [formatScriptLabel(script)] : [];
    stage.status =
      stage.failed.length > 0
        ? 'ERROR'
        : stage.warned.length > 0
          ? 'WARN'
          : 'OK';
  } catch {
    stage.failed = [formatScriptLabel(script)];
    stage.warned = [];
    stage.status = 'ERROR';
  } finally {
    stage.currentTask = undefined;
    stage.finishedAt = performance.now();
    dashboard.render(stages);
  }
}

async function runNpmScript(script: string): Promise<ScriptExecutionResult> {
  return await new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', script], {
      cwd: applicationRoot,
      env: {
        ...process.env,
        FORCE_COLOR: '0',
        NO_COLOR: '1',
        npm_config_cache: npmCacheDir,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const chunks: string[] = [];

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => chunks.push(chunk));
    child.stderr.on('data', (chunk: string) => chunks.push(chunk));
    child.on('error', (error: Error) => {
      reject(error);
    });
    child.on('close', (code) => {
      const output = chunks.join('');

      resolve({
        code: code ?? 1,
        hasWarnings: hasWarningOutput(output),
      });
    });
  });
}

function formatScriptLabel(script: string): string {
  switch (script) {
    case 'test:unit':
      return 'unit';
    case 'test:e2e:parallel':
      return 'e2e parallel';
    case 'test:e2e:serial':
      return 'e2e serial';
    default:
      return script;
  }
}

function hasWarningOutput(output: string): boolean {
  return output
    .split(/\r?\n/u)
    .some((line) =>
      /^(?:npm warn|warning\b|\[warn\b)/iu.test(line.trimStart()),
    );
}

function formatStatus(status: Status): string {
  return `[ ${STATUS_COLOR[status]}${status.padEnd(7, ' ')}${COLOR.reset} ]`;
}

function formatStageLabel(
  stage: StageState,
  includeRunningDetails: boolean,
): string {
  const segments = [`${COLOR.bold}${stage.name}${COLOR.unbold}`];
  const durationMs = getDurationMs(stage);

  if (
    includeRunningDetails &&
    stage.status === 'RUNNING' &&
    stage.currentTask &&
    durationMs !== undefined
  ) {
    segments.push(`(${stage.currentTask}, ${formatDuration(durationMs)})`);
  } else if (
    durationMs !== undefined &&
    stage.status !== 'RUNNING' &&
    stage.status !== 'WAITING' &&
    stage.status !== 'SKIPPED'
  ) {
    segments.push(`(${formatDuration(durationMs)})`);
  }

  return segments.join(' ');
}

function getDurationMs(stage: StageState): number | undefined {
  if (typeof stage.startedAt !== 'number') {
    return undefined;
  }

  if (typeof stage.finishedAt === 'number') {
    return Math.max(0, stage.finishedAt - stage.startedAt);
  }

  if (stage.status === 'RUNNING') {
    return Math.max(0, performance.now() - stage.startedAt);
  }

  return undefined;
}

function formatDuration(durationMs: number): string {
  if (durationMs < 1000) {
    return `${String(Math.round(durationMs))}ms`;
  }

  if (durationMs < 60_000) {
    return `${(durationMs / 1000).toFixed(1)}s`;
  }

  const minutes = Math.floor(durationMs / 60_000);
  const seconds = ((durationMs % 60_000) / 1000).toFixed(1);
  return `${String(minutes)}m ${seconds}s`;
}

function shouldUseDynamicDashboard(): boolean {
  if (process.env['RANDOMGEN_PRE_PUSH_STATIC'] === '1') {
    return false;
  }

  return process.stdout.isTTY;
}

runPrePush()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Unknown pre-push error';

    console.error(
      `${formatStatus('ERROR')} ${COLOR.bold}Pre-push${COLOR.unbold}`,
    );
    console.error(`  x ${message}`);
    process.exit(1);
  });
