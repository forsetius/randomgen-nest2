import supertest from 'supertest';
import { getBaseUrl } from '../globalAppUrl';

describe('CmsController', () => {
  describe('GET /pages/search', () => {
    it('returns hits for polish query', async () => {
      const res = await supertest(getBaseUrl())
        .get('/pages/search')
        .query({ term: 'E2E PL Poz C' })
        .expect(200);

      const slugs = JSON.parse(res.text) as string[];
      slugs.sort();
      expect(slugs).toEqual([
        'fragment/card_poz-c.html',
        'fragment/card_poz-c_kol1_poz1.html',
        'fragment/card_poz-c_kol1_poz2.html',
        'fragment/card_poz-c_kol2.html',
        'fragment/card_poz-c_kol2_poz1.html',
      ]);
      expect(slugs).not.toContain('fragment/card_poz-b_podpoz-1.html');
      expect(slugs).not.toContain('fragment/card_item-c.html');
    });

    it('returns hits for english query', async () => {
      const res = await supertest(getBaseUrl())
        .get('/pages/search?lang=en')
        .query({ term: 'E2E Item C' })
        .expect(200);

      const slugs = JSON.parse(res.text) as string[];
      slugs.sort();
      expect(slugs).toEqual([
        'fragment/card_item-c.html',
        'fragment/card_item-c_column1_item1.html',
        'fragment/card_item-c_column1_item2.html',
        'fragment/card_item-c_column2.html',
        'fragment/card_item-c_column2_item1.html',
      ]);
      expect(slugs).not.toContain('fragment/card_item-b_subitem-1.html');
      expect(slugs).not.toContain('fragment/card_poz-c.html');
    });
  });

  describe('GET /pages/tag/:tag', () => {
    it('returns polish pages for a matching tag', async () => {
      const res = await supertest(getBaseUrl())
        .get('/pages/tag/testTagA')
        .query({ lang: 'pl' })
        .expect(200);

      const slugs = JSON.parse(res.text) as string[];
      slugs.sort();
      expect(slugs).toEqual([
        'fragment/card_poz-c_kol1_poz1.html',
        'fragment/card_poz-c_kol1_poz2.html',
      ]);
      expect(slugs).not.toContain('fragment/card_poz-c_kol2.html');
    });
  });
});
