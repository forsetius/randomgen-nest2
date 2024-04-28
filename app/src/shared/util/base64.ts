export function decodeBase64(encodedText: string): string {
  return Buffer.from(encodedText, 'base64').toString('ascii');
}
