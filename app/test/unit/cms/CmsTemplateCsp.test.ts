import fs from 'node:fs';
import path from 'node:path';
import { APP_ROOT } from '../../../src/appConstants';

function readTemplate(templateName: string): string {
  return fs.readFileSync(
    path.join(APP_ROOT, 'content', 'cms', 'templates', templateName),
    'utf-8',
  );
}

describe('CMS template CSP safety', () => {
  test('keeps interactive templates free from inline scripts', () => {
    const templateNames = [
      'block/form-contact.njs',
      'block/form-full-search.njs',
      'block/form-tag.njs',
      'page/noaside.njs',
    ];

    templateNames.forEach((templateName) => {
      expect(readTemplate(templateName)).not.toMatch(/<script\b/);
    });
  });

  test('avoids htmx inline handlers and eval-based trigger filters', () => {
    const searchMarkup = [
      readTemplate('menu/topbar.njs'),
      readTemplate('block/form-full-search.njs'),
      readTemplate('block/form-tag.njs'),
    ].join('\n');

    expect(searchMarkup).not.toContain('hx-on:');
    expect(searchMarkup).not.toContain('keyup[');
    expect(searchMarkup).not.toContain('load[');
    expect(searchMarkup).toContain('hx-trigger="csp-search"');
  });

  test('disables htmx eval in the shared head script', () => {
    const headScript = fs.readFileSync(
      path.join(APP_ROOT, 'content', 'cms', 'static', 'ui', 'head.js'),
      'utf-8',
    );

    expect(headScript).toMatch(/allowEval\s*=\s*(false|!1)/u);
  });
});
