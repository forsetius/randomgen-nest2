import fs from 'node:fs';
import path from 'node:path';
import { APP_ROOT } from '../../../src/appConstants';

function readCmsFile(...segments: string[]): string {
  return fs.readFileSync(
    path.join(APP_ROOT, 'content', 'cms', ...segments),
    'utf-8',
  );
}

function readDictionary(lang: 'pl' | 'en'): Record<string, string> {
  return JSON.parse(readCmsFile('sources', lang, 'dictionary.json')) as Record<
    string,
    string
  >;
}

describe('CMS theme contract', () => {
  test('does not define obsolete translated labels for the theme selector', () => {
    const polishDictionary = readDictionary('pl');
    const englishDictionary = readDictionary('en');

    expect(polishDictionary).not.toHaveProperty('theme');
    expect(polishDictionary).not.toHaveProperty('themeLight');
    expect(polishDictionary).not.toHaveProperty('themeDark');
    expect(polishDictionary).not.toHaveProperty('themeSystem');
    expect(englishDictionary).not.toHaveProperty('theme');
    expect(englishDictionary).not.toHaveProperty('themeLight');
    expect(englishDictionary).not.toHaveProperty('themeDark');
    expect(englishDictionary).not.toHaveProperty('themeSystem');
  });

  test('keeps only the light-mode stylesheet assets on disk', () => {
    for (const fileName of ['styles.css', 'syntax.css']) {
      expect(
        fs.existsSync(
          path.join(APP_ROOT, 'content', 'cms', 'static', 'ui', fileName),
        ),
      ).toBe(true);
    }

    for (const fileName of [
      'styles-light.css',
      'styles-dark.css',
      'syntax-light.css',
      'syntax-dark.css',
    ]) {
      expect(
        fs.existsSync(
          path.join(APP_ROOT, 'content', 'cms', 'static', 'ui', fileName),
        ),
      ).toBe(false);
    }
  });

  test('uses light blue panel surfaces for the footer and right aside', () => {
    const themeStylesheet = readCmsFile('static', 'ui', 'styles.css');

    expect(themeStylesheet).toContain('--surface-blue-panel: #eaf6ff;');
    expect(themeStylesheet).toContain('--surface-blue-footer: #edf8ff;');
    expect(themeStylesheet).toContain('var(--surface-blue-panel)');
    expect(themeStylesheet).toContain('var(--surface-blue-footer)');
  });

  test('aligns footer menu columns to the right of the footer', () => {
    const footerRegionTemplate = readCmsFile(
      'templates',
      'include',
      'region-footer.njs',
    );
    const footerMenuTemplate = readCmsFile('templates', 'menu', 'footer.njs');
    const themeStylesheet = readCmsFile('static', 'ui', 'styles.css');

    expect(footerRegionTemplate).toContain('footer__navigation');
    expect(footerMenuTemplate).toContain('footer__menu');
    expect(themeStylesheet).toContain('.footer__navigation {');
    expect(themeStylesheet).toContain('justify-content: flex-end;');
    expect(themeStylesheet).toContain('.footer__menu {');
    expect(themeStylesheet).toContain('margin-left: auto;');
  });

  test('constrains markdown images rendered in the right aside', () => {
    const themeStylesheet = readCmsFile('static', 'ui', 'styles.css');

    expect(themeStylesheet).toMatch(
      /\.aside-right img\s*\{[\s\S]*display: block;[\s\S]*width: 100%;[\s\S]*max-width: 100%;[\s\S]*height: auto;[\s\S]*\}/u,
    );
  });

  test('places the bridge decor below right aside content', () => {
    const scienceFictionDecorStylesheet = readCmsFile(
      'static',
      'ui',
      'decors-sf.css',
    );

    expect(scienceFictionDecorStylesheet).not.toMatch(
      /\.aside-right\s*\{[\s\S]*decor-bridge\.png/u,
    );
    expect(scienceFictionDecorStylesheet).toMatch(
      /\.aside-right:has\(> \.d-grid:last-child\)::after\s*\{[\s\S]*content: "";[\s\S]*display: block;[\s\S]*width: 100%;[\s\S]*aspect-ratio: 369 \/ 297;[\s\S]*margin-top: 1\.5rem;[\s\S]*background: url\("decor-bridge\.png"\) no-repeat top center;[\s\S]*\}/u,
    );
  });

  test('uses blue themed gallery pager buttons', () => {
    const galleryTemplate = readCmsFile(
      'templates',
      'page-gallery',
      'default.njs',
    );
    const themeStylesheet = readCmsFile('static', 'ui', 'styles.css');

    expect(galleryTemplate).not.toContain('btn-outline-success');
    expect(galleryTemplate).toContain('pager-button');
    expect(themeStylesheet).toMatch(
      /\.pager-buttons \.pager-button\s*\{[\s\S]*border-color: var\(--surface-blue-border\);[\s\S]*color: var\(--brand-blue-700\);[\s\S]*background-color: var\(--surface-soft\);[\s\S]*\}/u,
    );
    expect(themeStylesheet).toMatch(
      /\.pager-buttons \.pager-button:is\(:hover, :focus-visible\)\s*\{[\s\S]*border-color: var\(--brand-blue-600\);[\s\S]*color: #ffffff;[\s\S]*background-color: var\(--brand-blue-600\);[\s\S]*\}/u,
    );
  });

  test('keeps the topbar action controls aligned with the forseti.pl styling', () => {
    const themeStylesheet = readCmsFile('static', 'ui', 'styles.css');

    expect(themeStylesheet).toMatch(
      /\.topbar__icon-button\s*\{[\s\S]*border-radius: 999px;[\s\S]*\}/u,
    );
    expect(themeStylesheet).toMatch(
      /\.topbar__lang-link\s*\{[\s\S]*border-radius: 999px;[\s\S]*\}/u,
    );
    expect(themeStylesheet).not.toContain('.theme-switcher');
    expect(themeStylesheet).toMatch(
      /\.search-form\s*\{\s*min-width: 100px;\s*\}/u,
    );
    expect(themeStylesheet).not.toContain('.search-form .form-control');
  });

  test('keeps head bootstrap script free from theme switching logic', () => {
    const headScript = readCmsFile('static', 'ui', 'head.js');

    expect(headScript).not.toContain('theme-preference');
    expect(headScript).not.toContain('prefers-color-scheme');
    expect(headScript).not.toContain('styles-dark.css');
    expect(headScript).not.toContain('styles-light.css');
    expect(headScript).not.toContain('syntax-dark.css');
    expect(headScript).not.toContain('syntax-light.css');
    expect(headScript).not.toContain('theme-toggle');
    expect(headScript).not.toContain('data-theme-value');
    expect(headScript).not.toContain('data-theme-stylesheet');
  });
});
