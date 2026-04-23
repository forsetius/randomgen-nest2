export function normalizeAppOrigin(host: string): string {
  return host === 'localhost' ? 'http://localhost' : host;
}
