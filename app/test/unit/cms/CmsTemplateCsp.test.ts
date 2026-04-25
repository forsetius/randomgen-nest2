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
      'form-contact.njs',
      'form-full-search.njs',
      'form-tag.njs',
      'page-tag-full-width.njs',
    ];

    templateNames.forEach((templateName) => {
      expect(readTemplate(templateName)).not.toMatch(/<script\b/);
    });
  });

  test('avoids htmx inline handlers and eval-based trigger filters', () => {
    const searchMarkup = [
      readTemplate('menu-topbar.njs'),
      readTemplate('form-full-search.njs'),
      readTemplate('form-tag.njs'),
    ].join('\n');

    expect(searchMarkup).not.toContain('hx-on:');
    expect(searchMarkup).not.toContain('keyup[');
    expect(searchMarkup).not.toContain('load[');
    expect(searchMarkup).toContain('hx-trigger="csp-search"');
    expect(searchMarkup).toContain('hx-trigger="tag-load"');
  });

  test('disables htmx eval in the shared head script', () => {
    const headScript = fs.readFileSync(
      path.join(APP_ROOT, 'content', 'cms', 'static', 'ui', 'head.js'),
      'utf-8',
    );

    expect(headScript).toContain('window.htmx.config.allowEval = false;');
  });
});
