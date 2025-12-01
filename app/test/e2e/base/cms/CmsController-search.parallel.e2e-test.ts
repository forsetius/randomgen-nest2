import supertest from 'supertest';
import { getBaseUrl } from '../../globalAppUrl';

describe('CmsController', () => {
  describe('GET /search', () => {
    it('returns hits for english query', async () => {
      const res = await supertest(getBaseUrl())
        .get('/search')
        .query({ term: 'aerostat' })
        .expect(200);

      const slugs = JSON.parse(res.text) as string[];
      expect(slugs).toContain('venus-aerostats');
      expect(slugs).not.toContain('mars-habitats');
    });
  });
});
