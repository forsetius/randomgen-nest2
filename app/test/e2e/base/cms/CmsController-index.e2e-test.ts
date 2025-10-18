import { NestExpressApplication } from '@nestjs/platform-express';
import { setupApp } from '../../setupApp';
import supertest, { Response } from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { Lang } from '@shared/types/Lang';

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
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await setupApp();
  });

  describe('GET /', () => {
    it('should return status 200 with a page in Polish language', async () => {
      const response = await supertest(app.getHttpServer())
        .get(`/`)
        .redirects(1);

      checkStatusAndLanguage(response, Lang.PL, HttpStatus.OK);
    });
  });

  describe('GET /?lang=$lang', () => {
    it.each([
      ['en', HttpStatus.OK],
      ['pl', HttpStatus.OK],
      ['de', HttpStatus.BAD_REQUEST],
    ])(
      'should return a page in "%s" language and status %d',
      async (lang, status) => {
        const response = await supertest(app.getHttpServer())
          .get(`/?lang=${lang}`)
          .redirects(1);

        checkStatusAndLanguage(response, lang, status);
      },
    );
  });

  describe('GET /:lang', () => {
    it.each([
      ['en', HttpStatus.OK],
      ['pl', HttpStatus.OK],
      ['de', HttpStatus.BAD_REQUEST],
    ])(
      'should return a page in "%s" language and status %d',
      async (lang, status) => {
        const response = await supertest(app.getHttpServer())
          .get(`/${lang}`)
          .redirects(1);

        checkStatusAndLanguage(response, lang, status);
      },
    );
  });

  describe('GET /:lang?lang=$lang', () => {
    it.each(['en', 'pl'])(
      `when calling /en?lang=%s should error with status 400`,
      async (lang: string) => {
        const response = await supertest(app.getHttpServer())
          .get(`/en?lang=${lang}`)
          .redirects(1);

        checkStatusAndLanguage(response, '', HttpStatus.BAD_REQUEST);
      },
    );
  });
});
