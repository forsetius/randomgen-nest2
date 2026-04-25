import supertest, { type Test } from 'supertest';
import { expectBalancedContentSecurityPolicy } from '../ContentSecurityPolicyAssertions';
import { getBaseUrl } from '../globalAppUrl';

interface CspEndpointCase {
  readonly name: string;
  readonly send: () => Test;
  readonly expectedStatus: number;
  readonly expectedLocation?: string;
}

describe('Content Security Policy (e2e)', () => {
  const client = supertest(getBaseUrl());
  const endpointCases: readonly CspEndpointCase[] = [
    {
      name: 'GET /',
      send: () => client.get('/'),
      expectedStatus: 302,
      expectedLocation: '/pages/pl/index.html',
    },
    {
      name: 'GET /en',
      send: () => client.get('/en'),
      expectedStatus: 302,
      expectedLocation: '/pages/en/index.html',
    },
    {
      name: 'GET /search',
      send: () => client.get('/search').query({ term: 'E2E PL Poz C' }),
      expectedStatus: 200,
    },
    {
      name: 'GET /tag/:tag',
      send: () => client.get('/tag/testTagA').query({ lang: 'pl' }),
      expectedStatus: 200,
    },
    {
      name: 'GET /tag',
      send: () => client.get('/tag').query({ lang: 'pl' }),
      expectedStatus: 200,
    },
    {
      name: 'POST /contact',
      send: () =>
        client.post('/contact').send({
          catcher: '',
          name: 'Anna',
          email: 'anna@example.test',
          title: 'Greetings',
          content: 'Hello from the contact form.',
        }),
      expectedStatus: 201,
    },
    {
      name: 'GET /pages/pl/index.html',
      send: () => client.get('/pages/pl/index.html'),
      expectedStatus: 200,
    },
    {
      name: 'GET /ui/csp-probe.js',
      send: () => client.get('/ui/csp-probe.js'),
      expectedStatus: 200,
    },
    {
      name: 'GET /media/csp-probe.svg',
      send: () => client.get('/media/csp-probe.svg'),
      expectedStatus: 200,
    },
    {
      name: 'GET /ping',
      send: () => client.get('/ping'),
      expectedStatus: 200,
    },
    {
      name: 'GET /technobabble (shadowed route)',
      send: () => client.get('/technobabble').query({ lang: 'pl' }),
      expectedStatus: 400,
    },
    {
      name: 'GET /api/1.0/startrek/technobabble',
      send: () =>
        client.get('/api/1.0/startrek/technobabble').query({ lang: 'en' }),
      expectedStatus: 200,
    },
  ] as const;

  it.each(endpointCases)(
    '$name returns a CSP that is permissive enough and still strict',
    async ({ send, expectedStatus, expectedLocation }) => {
      const response = await send().expect(expectedStatus);

      if (expectedLocation !== undefined) {
        expect(response.headers['location']).toBe(expectedLocation);
      }

      expectBalancedContentSecurityPolicy(response);
    },
  );
});
