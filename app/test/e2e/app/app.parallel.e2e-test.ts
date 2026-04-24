import supertest from 'supertest';
import { getBaseUrl } from '../globalAppUrl';

describe('AppController (e2e)', () => {
  it('/ping (GET)', () =>
    supertest(getBaseUrl()).get('/ping').expect(200).expect('Hello World!'));
});
