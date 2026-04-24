import { spawnSync } from 'child_process';
import { rmSync } from 'fs';
import { join, resolve } from 'path';
import process from 'process';
import { stringifyError } from '@forsetius/glitnir-shared';

const applicationRootDirectory = resolve(process.cwd());
const distTestDirectory = join(applicationRootDirectory, 'dist-test');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const color = {
  blue: '\x1B[1;34m',
  bold: '\x1B[1m',
  green: '\x1B[1;32m',
  red: '\x1B[1;31m',
  reset: '\x1B[0m',
};

function cleanupDistTest(): void {
  try {
    rmSync(distTestDirectory, { force: true, recursive: true });
  } catch (error: unknown) {
    console.warn(
      `${color.red}Failed to delete dist-test: ${describeUnknownError(error)}${color.reset}`,
    );
  }
}

function describeUnknownError(error: unknown): string {
  return error instanceof Error ? error.message : stringifyError(error);
}

function runStep(name: string, command: string, args: string[]): number {
  console.log(`\n${color.blue}> ${name}${color.reset}`);

  const result = spawnSync(command, args, {
    cwd: applicationRootDirectory,
    stdio: 'inherit',
  });

  const exitCode = result.status ?? 1;

  if (result.error !== undefined) {
    console.error(
      `${color.red}${name} failed to start: ${result.error.message}${color.reset}`,
    );
  }

  if (exitCode === 0) {
    console.log(`${color.green}${name} OK${color.reset}`);
  } else {
    console.log(
      `${color.red}${name} FAIL (exit ${String(exitCode)})${color.reset}`,
    );
  }

  return exitCode;
}

function runNpmScript(name: string): number {
  return runStep(name, npmCommand, ['run', '-s', name]);
}

function formatStatus(exitCode: number): string {
  return exitCode === 0
    ? `${color.green}OK${color.reset}`
    : `${color.red}FAIL${color.reset}`;
}

process.on('exit', cleanupDistTest);

runNpmScript('test:build');

const unitExitCode = runNpmScript('test:unit');
const parallelExitCode = runNpmScript('test:e2e:parallel');
const serialExitCode = runNpmScript('test:e2e:serial');

const finalExitCode =
  unitExitCode === 0 && parallelExitCode === 0 && serialExitCode === 0 ? 0 : 1;

console.log(`\n${color.bold}Summary:${color.reset}`);
console.log(`  unit:          ${formatStatus(unitExitCode)}`);
console.log(`  e2e-parallel:  ${formatStatus(parallelExitCode)}`);
console.log(`  e2e-serial:    ${formatStatus(serialExitCode)}`);
console.log('  cleanup:       dist-test deleted');

process.exitCode = finalExitCode;
