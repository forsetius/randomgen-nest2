import { HttpStatus } from '@nestjs/common';
import supertest, { Response } from 'supertest';
import { getBaseUrl } from '../globalAppUrl';

function checkStatusAndLanguage(
  response: Response,
  lang: string,
  status: HttpStatus,
) {
  expect(response.status).toBe(status);

  if (status === HttpStatus.OK) {
    expect(
      response.text.startsWith(`<!DOCTYPE html><html lang="${lang}">`),
    ).toEqual(true);
  }
}

describe('CmsController', () => {
  describe('GET /', () => {
    it('should redirect to Polish CMS index page', async () => {
      await supertest(getBaseUrl())
        .get(`/`)
        .expect(HttpStatus.FOUND)
        .expect('Location', '/pages/pl/index.html');
    });

    it('renders CSP-safe search markup without inline htmx handlers', async () => {
      const response = await supertest(getBaseUrl()).get(`/`).redirects(1);

      expect(response.text).toContain('hx-trigger="csp-search"');
      expect(response.text).toContain('data-results-container="searchResults"');
      expect(response.text).not.toContain('hx-on:');
      expect(response.text).not.toContain('keyup[this.value.length >= 3]');
    });
  });

  describe('GET /pages/:lang/index.html', () => {
    it.each([
      ['en', HttpStatus.OK],
      ['pl', HttpStatus.OK],
    ])(
      'should return a page in "%s" language and status %d',
      async (lang, status) => {
        const response = await supertest(getBaseUrl())
          .get(`/pages/${lang}/index.html`)
          .redirects(1);

        checkStatusAndLanguage(response, lang, status);
      },
    );
  });

  describe('GET /pages/:lang/:slug.html', () => {
    it('renders legacy aside slot content in the right sidebar', async () => {
      const response = await supertest(getBaseUrl())
        .get('/pages/en/item-c.html')
        .expect(HttpStatus.OK);

      expect(response.text).toContain('class="aside-right col-lg-3 col-xl-4"');
      expect(response.text).toContain('Test aside content');
    });

    it('renders inline media blocks that reuse the gallery lightbox template', async () => {
      const response = await supertest(getBaseUrl())
        .get('/pages/pl/poz-d.html')
        .expect(HttpStatus.OK);

      expect(response.text).toContain('href="/media/test-inline-image.jpg"');
      expect(response.text).toContain('src="/media/test-inline-image.jpg"');
      expect(response.text).toContain('data-caption="Inline test image"');
    });
  });

  describe('GET /:lang', () => {
    it.each(['en', 'pl'])(
      'should redirect "%s" language root to the CMS index page',
      async (lang: string) => {
        await supertest(getBaseUrl())
          .get(`/${lang}`)
          .expect(HttpStatus.FOUND)
          .expect('Location', `/pages/${lang}/index.html`);
      },
    );
  });
});
