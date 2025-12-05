import {
  getBasename,
  removeWhitespace,
  slugify,
  stringifyError,
  uuidRegexp,
} from '@shared/util/string';

describe('getBasename', () => {
  it.each([
    ['baz', '/foo/bar/baz.txt'],
    ['C:\\foo\\bar\\baz.tar', 'C:\\foo\\bar\\baz.tar.gz'],
    ['archive', 'archive'],
    ['.bashrc', '.bashrc'],
    ['subdir', 'dir/subdir/'],
    ['', ''],
  ])('returns %s for %s', (expected, input) => {
    expect(getBasename(input)).toBe(expected);
  });
});

describe('removeWhitespace', () => {
  it.each([
    ['a b c', 'abc'],
    ['\t tabbed \n text ', 'tabbedtext'],
    ['no-whitespace', 'no-whitespace'],
    ['   ', ''],
    ['', ''],
  ])('removes whitespace from %s', (input, expected) => {
    expect(removeWhitespace(input)).toBe(expected);
  });
});

describe('slugify', () => {
  it.each([
    ['Café Rąńćęr', 'cafe-rancer'],
    ['Hello   World!', 'hello-world'],
    ['Already-slugified_value', 'already-slugified_value'],
    ['Symbols!@#', 'symbols'],
    ['  multiple   spaces\tand newline\n', 'multiple-spaces-and-newline'],
    ['', ''],
  ])('slugifies %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe('uuidRegexp', () => {
  it.each([
    ['550e8400-e29b-41d4-a716-446655440000', true],
    ['ffffffff-ffff-4fff-8fff-ffffffffffff', true],
    ['550e8400e29b41d4a716446655440000', false],
    ['550e8400-e29b-11d4-a716-446655440000', false],
    ['not-a-uuid', false],
    ['', false],
  ])('matches = %s for %s', (input, expected) => {
    expect(uuidRegexp.test(input)).toBe(expected);
  });
});

describe('stringifyError', () => {
  class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
    }
  }

  it.each([
    [new Error('standard failure'), 'standard failure'],
    [new CustomError('custom failure'), 'custom failure'],
    ['plain string', 'plain string'],
    [42, '42'],
    [null, 'null'],
    [undefined, 'undefined'],
    [{ key: 'value' }, '[object Object]'],
    [Symbol('marker'), 'Symbol(marker)'],
  ])('stringifies %s', (input, expected) => {
    expect(stringifyError(input)).toBe(expected);
  });
});
