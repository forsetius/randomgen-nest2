import path from 'node:path';
import { APP_ROOT } from '../../appRoot';

/**
 * Resolve a path relative to the project root
 *
 * Removes leading and trailing slashes and dots
 */
export function resolveAppRelativePath(inputPath: string): string {
  const trimmed = inputPath
    .trim()
    .replace(/^\.?[\\/]+/, '')
    .replace(/[\\/]+$/, '');

  return path.resolve(APP_ROOT, trimmed);
}

/**
 * Check if a path is inside the project root
 */
export function isInsideProject(absolutePath: string): boolean {
  const normalizedPath = path.resolve(absolutePath);

  const relative = path.relative(APP_ROOT, normalizedPath);

  return (
    relative === '' ||
    (!relative.startsWith('..') && !path.isAbsolute(relative))
  );
}
