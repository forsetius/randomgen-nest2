import { decodeBase64 } from '@shared/util/ciphers/base64';

describe('decodeBase64', () => {
  it.each([
    ['SGVsbG8=', 'Hello'],
    ['V29ybGQh', 'World!'],
    ['ICAg', '   '],
    ['U3BhY2VzPyE=', 'Spaces?!'],
    ['', ''],
    ['####', ''],
  ])('decodes %s', (input, expected) => {
    expect(decodeBase64(input)).toBe(expected);
  });
});
