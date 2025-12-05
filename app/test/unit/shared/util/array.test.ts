import { findDuplicates } from '@shared/util/array';
import type { JsPrimitive } from '@shared/types/types';
import { groupBy, sumBy } from '@shared/util/array';
import type { PickByType } from '@shared/types/PickByType';

describe('findDuplicates', () => {
  const sharedSymbol = Symbol('duplicate');
  const uniqueSymbolA = Symbol('uniqueA');
  const uniqueSymbolB = Symbol('uniqueB');

  const duplicatePrimitiveCases: [string, JsPrimitive[], JsPrimitive[]][] = [
    [
      'string',
      ['apple', 'banana', 'apple', 'orange', 'banana'],
      ['apple', 'banana'],
    ],
    ['number', [1, 2, 3, 2, 4, NaN, NaN, 1], [2, NaN, 1]],
    ['bigint', [10n, 1n, 10n], [10n]],
    ['boolean', [true, false, true, false], [true, false]],
    ['symbol', [sharedSymbol, sharedSymbol, Symbol('unique')], [sharedSymbol]],
    ['null', [null, null, null], [null]],
    ['undefined', [undefined, undefined, undefined], [undefined]],
  ];

  const uniquePrimitiveCases: [string, JsPrimitive[]][] = [
    ['string', ['one', 'two', 'three']],
    ['number', [1, 2, 3, NaN]],
    ['bigint', [1n, 2n, 3n]],
    ['boolean', [true, false]],
    ['symbol', [uniqueSymbolA, uniqueSymbolB]],
    ['null', [null]],
    ['undefined', [undefined]],
  ];

  it.each(duplicatePrimitiveCases)(
    'returns duplicates for %s arrays',
    (_, items, expected) => {
      expect(findDuplicates(items)).toEqual(expected);
    },
  );

  it.each(uniquePrimitiveCases)(
    'returns an empty array when there are no duplicates in %s arrays',
    (_, items) => {
      expect(findDuplicates(items)).toEqual([]);
    },
  );

  it('returns an empty array when items is empty', () => {
    expect(findDuplicates([])).toEqual([]);
  });
});

describe('groupBy', () => {
  const data = [
    { id: 1, role: 'admin', country: 'PL' },
    { id: 2, role: 'user', country: 'PL' },
    { id: 3, role: 'admin', country: 'US' },
    { id: 4, role: 'user', country: 'US' },
    { id: 5, role: 'guest', country: 'DE' },
  ];

  it('groups by role', () => {
    const result = groupBy(data, (item) => item.role);
    expect(result).toEqual({
      admin: [
        { id: 1, role: 'admin', country: 'PL' },
        { id: 3, role: 'admin', country: 'US' },
      ],
      user: [
        { id: 2, role: 'user', country: 'PL' },
        { id: 4, role: 'user', country: 'US' },
      ],
      guest: [{ id: 5, role: 'guest', country: 'DE' }],
    });
  });

  it('groups by country', () => {
    const result = groupBy(data, (item) => item.country);
    expect(result).toEqual({
      PL: [
        { id: 1, role: 'admin', country: 'PL' },
        { id: 2, role: 'user', country: 'PL' },
      ],
      US: [
        { id: 3, role: 'admin', country: 'US' },
        { id: 4, role: 'user', country: 'US' },
      ],
      DE: [{ id: 5, role: 'guest', country: 'DE' }],
    });
  });

  it('returns empty record for empty collection', () => {
    expect(groupBy([], () => 'anything')).toEqual({});
  });
});

describe('sumBy', () => {
  const collection = [
    { name: 'alpha', count: 10, price: 1.5 },
    { name: 'beta', count: 5, price: 2.25 },
    { name: 'gamma', count: 0, price: 3.75 },
  ];

  it.each([
    ['count', 15],
    ['price', 7.5],
  ] as [keyof PickByType<(typeof collection)[number], number>, number][])(
    'sums by field',
    (field, expected) => {
      expect(sumBy(collection, field)).toBe(expected);
    },
  );
});
