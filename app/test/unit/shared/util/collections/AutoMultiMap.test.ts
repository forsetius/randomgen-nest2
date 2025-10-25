import { AutoMultiMap } from '@shared/util/collections/AutoMultiMap';

describe('AutoMultiMap', () => {
  describe('getCollection', () => {
    it.each<[string, string | number]>([
      ['string key', 'alpha'],
      ['empty string key', ''],
      ['numeric key', 0],
    ])('auto-creates collection for %s', (_, key) => {
      const map = new AutoMultiMap<string | number, number>();

      const collection = map.getCollection(key);

      expect(collection).toEqual([]);
      expect(map.get(key)).toBe(collection);
    });

    it('returns same collection reference when accessed repeatedly', () => {
      const map = new AutoMultiMap<string, number>();

      const first = map.getCollection('shared');
      first.push(1);
      const second = map.getCollection('shared');

      expect(second).toBe(first);
      expect(second).toEqual([1]);
    });
  });

  describe('add', () => {
    it.each<[string, string, number[]]>([
      ['single value', 'alpha', [1]],
      ['multiple values preserve order', 'beta', [3, 1, 4]],
      ['duplicate values are stored', 'gamma', [2, 2, 2]],
    ])('%s', (_, key, values) => {
      const map = new AutoMultiMap<string, number>();

      values.forEach((value) => {
        map.add(key, value);
      });

      expect(map.size).toBe(1);
      expect(map.getCollection(key)).toEqual(values);
    });

    it('keeps collections isolated per key', () => {
      const map = new AutoMultiMap<string, number>();

      map.add('primary', 1);
      map.add('secondary', 5);
      map.add('primary', 3);

      expect(map.getCollection('primary')).toEqual([1, 3]);
      expect(map.getCollection('secondary')).toEqual([5]);
    });
  });
});
