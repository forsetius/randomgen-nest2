import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { APP_ROOT } from '../../../src/appConstants';

type DomEventListener = (event: unknown) => void;

interface ThemeStylesheetLink {
  rel?: string;
  type?: string;
  href?: string;
  dataset: Record<string, string>;
  remove: () => void;
}

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
  test('defines translated labels for the theme selector in both dictionaries', () => {
    const polishDictionary = readDictionary('pl');
    const englishDictionary = readDictionary('en');

    expect(polishDictionary).toMatchObject({
      theme: 'MOTYW',
      themeLight: 'Jasny',
      themeDark: 'Ciemny',
      themeSystem: 'Systemowy',
    });
    expect(englishDictionary).toMatchObject({
      theme: 'THEME',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System',
    });
  });

  test('keeps all theme stylesheets referenced by the theme script on disk', () => {
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
      ).toBe(true);
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
    expect(themeStylesheet).toMatch(
      /\.theme-switcher__menu\s*\{[\s\S]*border-radius: 1rem;[\s\S]*\}/u,
    );
    expect(themeStylesheet).toMatch(
      /\.theme-switcher__item\s*\{[\s\S]*border-radius: 0\.8rem;[\s\S]*\}/u,
    );
    expect(themeStylesheet).toMatch(
      /\.search-form\s*\{\s*min-width: 100px;\s*\}/u,
    );
    expect(themeStylesheet).not.toContain('.search-form .form-control');
  });

  test('switches syntax stylesheet according to the stored theme preference', () => {
    const headScript = readCmsFile('static', 'ui', 'head.js');
    const themeIcon = {
      className: 'bi bi-moon-stars-fill',
    };
    const toggleButton = {
      dataset: {},
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
      querySelector: jest.fn(() => themeIcon),
    };
    const themeOptions = [
      {
        dataset: { themeValue: 'light' },
        addEventListener: jest.fn(),
        setAttribute: jest.fn(),
      },
      {
        dataset: { themeValue: 'dark' },
        addEventListener: jest.fn(),
        setAttribute: jest.fn(),
      },
      {
        dataset: { themeValue: 'system' },
        addEventListener: jest.fn(),
        setAttribute: jest.fn(),
      },
    ];
    const mediaQueryList = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const localStorageMock = {
      getItem: jest.fn(() => 'dark'),
      setItem: jest.fn(),
    };
    const documentListeners = new Map<string, DomEventListener>();
    const themeStylesheetLinks: ThemeStylesheetLink[] = [];
    const context = {
      window: {
        htmx: { config: { allowEval: true } },
        location: { search: '' },
        localStorage: localStorageMock,
        matchMedia: jest.fn(() => mediaQueryList),
      },
      document: {
        addEventListener: jest.fn(
          (eventName: string, listener: DomEventListener) => {
            documentListeners.set(eventName, listener);
          },
        ),
        createElement: jest.fn(() => {
          const linkElement: ThemeStylesheetLink = {
            dataset: {},
            remove: () => {
              const currentIndex = themeStylesheetLinks.indexOf(linkElement);

              if (currentIndex >= 0) {
                themeStylesheetLinks.splice(currentIndex, 1);
              }
            },
          };

          return linkElement;
        }),
        getElementById: jest.fn((id: string) => {
          switch (id) {
            case 'theme-toggle':
              return toggleButton;
            default:
              return null;
          }
        }),
        head: {
          appendChild: jest.fn((element: ThemeStylesheetLink) => {
            themeStylesheetLinks.push(element);
          }),
        },
        querySelectorAll: jest.fn((selector: string) => {
          if (selector === '[data-theme-value]') {
            return themeOptions;
          }

          if (selector === 'link[data-theme-stylesheet]') {
            return themeStylesheetLinks;
          }

          return [];
        }),
      },
      URLSearchParams,
      console,
    };

    vm.runInNewContext(headScript, context);

    const domContentLoadedListener = documentListeners.get('DOMContentLoaded');

    expect(domContentLoadedListener).toBeDefined();

    domContentLoadedListener?.(new Event('DOMContentLoaded'));

    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme-preference');
    expect(themeStylesheetLinks.map(({ href }) => href)).toEqual([
      '/ui/styles-dark.css',
      '/ui/syntax-dark.css',
    ]);
    expect(themeIcon.className).toBe('bi bi-moon-fill');
    expect(mediaQueryList.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });
});
