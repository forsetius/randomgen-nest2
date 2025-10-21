import supertest from 'supertest';
import { getBaseUrl } from '../globalAppUrl';

describe('AppController (e2e)', () => {
  it('/ (GET)', () =>
    supertest(getBaseUrl()).get('/').expect(200).expect('Hello World!'));
});
