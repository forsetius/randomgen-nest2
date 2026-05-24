window.htmx && (window.htmx.config.allowEval = !1);
const themePreferenceStorageKey = 'theme-preference',
  themeStylesheetBasePath = '/ui/',
  themeStylesheetFileNamesByMode = {
    light: ['styles-light.css', 'syntax-light.css'],
    dark: ['styles-dark.css', 'syntax-dark.css'],
  },
  darkModeMediaQuery =
    'function' == typeof window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;
function getStoredThemePreference() {
  return window.localStorage?.getItem('theme-preference') ?? 'system';
}
function resolveAppliedTheme(e) {
  return 'dark' === e
    ? 'dark'
    : 'light' === e
      ? 'light'
      : darkModeMediaQuery?.matches
        ? 'dark'
        : 'light';
}
function resolveThemeIconClassName(e) {
  switch (e) {
    case 'light':
      return 'bi bi-sun-fill';
    case 'dark':
      return 'bi bi-moon-fill';
    default:
      return 'bi bi-moon-stars-fill';
  }
}
function createThemeStylesheetLink() {
  const e = document.createElement('link');
  return (
    (e.rel = 'stylesheet'),
    (e.type = 'text/css'),
    (e.dataset.themeStylesheet = 'true'),
    e
  );
}
function getThemeStylesheetLinks() {
  return Array.from(document.querySelectorAll('link[data-theme-stylesheet]'));
}
function buildThemeStylesheetHref(e) {
  return `/ui/${e}`;
}
function syncThemeStylesheets(e) {
  const t =
      themeStylesheetFileNamesByMode[e] ?? themeStylesheetFileNamesByMode.light,
    r = getThemeStylesheetLinks();
  (t.forEach((e, t) => {
    const n = r[t] ?? createThemeStylesheetLink();
    ((n.href = buildThemeStylesheetHref(e)),
      r[t] || document.head?.appendChild(n));
  }),
    r.slice(t.length).forEach((e) => {
      e.remove();
    }));
}
function applyThemePreference(e) {
  syncThemeStylesheets(resolveAppliedTheme(e));
  const t = document.getElementById('theme-toggle'),
    r = t?.querySelector('i');
  (r && (r.className = resolveThemeIconClassName(e)),
    t && (t.dataset.themePreference = e),
    document.querySelectorAll('[data-theme-value]').forEach((t) => {
      t.setAttribute('aria-pressed', String(t.dataset.themeValue === e));
    }));
}
function initializeThemeSelector() {
  const e = document.getElementById('theme-toggle');
  e && 'true' !== e.dataset.themeBound
    ? ((e.dataset.themeBound = 'true'),
      document.querySelectorAll('[data-theme-value]').forEach((e) => {
        e.addEventListener('click', () => {
          const t = e.dataset.themeValue ?? 'system';
          (window.localStorage?.setItem('theme-preference', t),
            applyThemePreference(t));
        });
      }),
      applyThemePreference(getStoredThemePreference()))
    : applyThemePreference(getStoredThemePreference());
}
(darkModeMediaQuery?.addEventListener('change', () => {
  'system' === getStoredThemePreference() && applyThemePreference('system');
}),
  applyThemePreference(getStoredThemePreference()),
  document.addEventListener('DOMContentLoaded', initializeThemeSelector));
const qs = Object.fromEntries(
  Array.from(new URLSearchParams(window.location.search).entries()).map(
    ([e, t]) => [e, decodeURIComponent(t)],
  ),
);
