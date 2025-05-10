import path from 'node:path';

export function getBasename(filename: string): string {
  return path.basename(filename, path.extname(filename));
}

export function removeWhitespace(value: string) {
  return value.replace(/\s/g, '');
}

export const uuidRegexp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;
