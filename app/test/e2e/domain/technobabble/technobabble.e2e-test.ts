import supertest from 'supertest';
import { getBaseUrl } from '../../globalAppUrl';

const regexpPl = /^[\p{L}-]+ [\p{L}-]+ [\p{L}-]+ [\p{L}-]+ [\p{L}-]+$/u;
const regexpEn = /^[\w-]+ [\w-]+ [\w-]+ [\w-]+ [\w-]+$/u;

describe('TechnobabbleController (e2e)', () => {
  it('/technobabble (GET)', () =>
    supertest(getBaseUrl()).get('/technobabble').expect(200).expect(regexpPl));

  it('/api/1.0/startrek/technobabble (GET)', () =>
    supertest(getBaseUrl())
      .get('/api/1.0/startrek/technobabble')
      .expect(200)
      .expect(regexpPl));

  it('/technobabble?lang=pl (GET)', () =>
    supertest(getBaseUrl())
      .get('/technobabble?lang=pl')
      .expect(200)
      .expect(regexpPl));

  it('/api/1.0/startrek/technobabble?lang=pl (GET)', () =>
    supertest(getBaseUrl())
      .get('/api/1.0/startrek/technobabble?lang=pl')
      .expect(200)
      .expect(regexpPl));

  it('/technobabble?lang=en (GET)', () =>
    supertest(getBaseUrl())
      .get('/technobabble?lang=en')
      .expect(200)
      .expect(regexpEn));

  it('/api/1.0/startrek/technobabble?lang=en (GET)', () =>
    supertest(getBaseUrl())
      .get('/api/1.0/startrek/technobabble?lang=en')
      .expect(200)
      .expect(regexpEn));
});
