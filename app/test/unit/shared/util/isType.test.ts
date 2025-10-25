import { isRecord, isStringNumber } from '@shared/util/isType';

describe('isRecord', () => {
  it.each<[string, unknown, boolean]>([
    ['plain object literal', {}, true],
    ['object with properties', { key: 'value' }, true],
    ['object created with null prototype', Object.create(null), true],
    ['frozen object', Object.freeze({ one: 1 }), true],
    ['array', [], false],
    ['date instance', new Date(), false],
    ['map instance', new Map(), false],
    ['class instance', new (class Foo {})(), false],
    ['null', null, false],
    ['undefined', undefined, false],
    ['string primitive', 'string', false],
    ['number primitive', 42, false],
    ['symbol primitive', Symbol('sym'), false],
    ['function', () => ({}), false],
  ])('%s', (_, value, expected) => {
    expect(isRecord(value)).toBe(expected);
  });
});

describe('isStringNumber', () => {
  it.each([
    ['0', true],
    ['00123', true],
    ['-42', true],
    ['42.7', true],
    ['  15 ', true],
    ['abc', false],
    ['12a', false],
    ['', false],
    [undefined, false],
    ['NaN', false],
  ])('returns %s for %s', (value, expected) => {
    expect(isStringNumber(value)).toBe(expected);
  });
});
