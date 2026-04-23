import supertest from 'supertest';
import { getBaseUrl } from '../globalAppUrl';

describe('CmsController', () => {
  describe('POST /contact', () => {
    it('accepts a valid contact form payload', async () => {
      await supertest(getBaseUrl())
        .post('/contact')
        .send({
          catcher: '',
          name: 'Anna',
          email: 'anna@example.test',
          title: 'Greetings',
          content: 'Hello from the contact form.',
        })
        .expect(201)
        .expect({});
    });
  });
});
