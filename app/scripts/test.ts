import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import { join, relative, resolve } from 'path';
import process from 'process';

const applicationRootDirectory = resolve(process.cwd());
const e2eTestDirectory = join(applicationRootDirectory, 'test', 'e2e');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const color = {
  blue: '\x1B[1;34m',
  bold: '\x1B[1m',
  green: '\x1B[1;32m',
  red: '\x1B[1;31m',
  reset: '\x1B[0m',
};

function isE2eTestFile(filePath: string): boolean {
  return filePath.endsWith('.e2e-test.ts') || filePath.endsWith('.e2e-spec.ts');
}

function isClassifiedE2eTestFile(filePath: string): boolean {
  return (
    filePath.endsWith('.parallel.e2e-test.ts') ||
    filePath.endsWith('.serial.e2e-test.ts')
  );
}

function findE2eTestFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...findE2eTestFiles(entryPath));
      continue;
    }

    if (entry.isFile() && isE2eTestFile(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
}

function runE2eDiscoveryGuard(): number {
  console.log(`\n${color.blue}> test:e2e:discovery${color.reset}`);

  const unclassifiedTestFiles = findE2eTestFiles(e2eTestDirectory).filter(
    (filePath) => !isClassifiedE2eTestFile(filePath),
  );

  if (unclassifiedTestFiles.length === 0) {
    console.log(`${color.green}test:e2e:discovery OK${color.reset}`);
    return 0;
  }

  console.error(
    `${color.red}Unclassified e2e test files found. Rename each file to ` +
      `*.parallel.e2e-test.ts or *.serial.e2e-test.ts.${color.reset}`,
  );

  for (const filePath of unclassifiedTestFiles) {
    console.error(`  - ${relative(applicationRootDirectory, filePath)}`);
  }

  console.log(`${color.red}test:e2e:discovery FAIL${color.reset}`);
  return 1;
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

const discoveryExitCode = runE2eDiscoveryGuard();
const typecheckExitCode = runNpmScript('test:typecheck');
const unitExitCode = runNpmScript('test:unit');
const parallelExitCode = runNpmScript('test:e2e:parallel');
const serialExitCode = runNpmScript('test:e2e:serial');

const finalExitCode =
  discoveryExitCode === 0 &&
  typecheckExitCode === 0 &&
  unitExitCode === 0 &&
  parallelExitCode === 0 &&
  serialExitCode === 0
    ? 0
    : 1;

console.log(`\n${color.bold}Summary:${color.reset}`);
console.log(`  e2e-discovery: ${formatStatus(discoveryExitCode)}`);
console.log(`  typecheck:      ${formatStatus(typecheckExitCode)}`);
console.log(`  unit:          ${formatStatus(unitExitCode)}`);
console.log(`  e2e-parallel:  ${formatStatus(parallelExitCode)}`);
console.log(`  e2e-serial:    ${formatStatus(serialExitCode)}`);

process.exitCode = finalExitCode;
