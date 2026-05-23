async function loadFragment(e) {
  try {
    const t = await fetch(e);
    return 404 === t.status
      ? (console.warn(`Fragment from ${e} returned 404`), '')
      : t.ok
        ? await t.text()
        : (console.error(`Error ${t.status} while loading ${e}`), '');
  } catch (t) {
    return (console.error(`Network error while loading ${e}:`, t), '');
  }
}
function parseResultUrls(e, t) {
  const n = JSON.parse(e);
  if (!Array.isArray(n))
    throw new Error(`${t} response payload is not an array.`);
  return n;
}
async function loadResultUrls(e, t) {
  try {
    const n = await fetch(e);
    return 404 === n.status
      ? (console.warn(`${t} request to ${e} returned 404`), [])
      : n.ok
        ? parseResultUrls(await n.text(), t)
        : (console.error(`Error ${n.status} while loading ${e}`), []);
  } catch (e) {
    return (console.error(`Invalid JSON response for ${t}:`, e), []);
  }
}
async function renderResultFragments(e, t) {
  e.innerHTML = '';
  for (const n of t) e.insertAdjacentHTML('beforeend', await loadFragment(n));
  e.classList.remove('d-none');
}
const searchRequestTimers = new WeakMap();
function clearResultsContainer(e) {
  ((e.innerHTML = ''), e.classList.add('d-none'));
}
function scheduleSearchRequest(e) {
  const t = searchRequestTimers.get(e);
  t && window.clearTimeout(t);
  const n = window.setTimeout(() => {
    (htmx.trigger(e, 'csp-search'), searchRequestTimers.delete(e));
  }, 300);
  searchRequestTimers.set(e, n);
}
async function handleSearchResponse(e, t) {
  const n = document.getElementById(t);
  if (!n) return;
  let s;
  try {
    s = parseResultUrls(e.detail.xhr.responseText, 'search');
  } catch (e) {
    return void console.error('Invalid JSON response for search:', e);
  }
  await renderResultFragments(n, s);
}
function initializeTopbarSearch() {
  const e = document.getElementById('searchForm'),
    t =
      document.getElementById('site-search') ??
      document.getElementById('searchInput'),
    n = document.getElementById('searchResults'),
    s = document.getElementById('pageOverlay');
  if (!(e && t && n && s)) return;
  const a = () => {
    ((t.value = ''), s.classList.add('d-none'), clearResultsContainer(n));
  };
  (t.addEventListener('input', function () {
    (this.value.length > 0
      ? s.classList.remove('d-none')
      : s.classList.add('d-none'),
      this.value.length < 3
        ? clearResultsContainer(n)
        : (n.classList.remove('d-none'), scheduleSearchRequest(this)));
  }),
    t.addEventListener('keydown', function (e) {
      ('Escape' !== e.key && 'Esc' !== e.key) || a();
    }),
    document.addEventListener('click', function (t) {
      e.contains(t.target) || a();
    }));
}
function initializeFullSearch() {
  const e = document.getElementById('fullSearchInput'),
    t = document.getElementById('fullSearchResults'),
    n = document.getElementById('clearFullSearchBtn');
  if (!e || !t || !n) return;
  const s = () => {
      e.value.length < 3
        ? clearResultsContainer(t)
        : (t.classList.remove('d-none'), scheduleSearchRequest(e));
    },
    a = () => {
      ((e.value = ''), clearResultsContainer(t));
    };
  ((e.value = qs.term ?? ''),
    e.addEventListener('input', s),
    e.addEventListener('keydown', function (e) {
      ('Escape' !== e.key && 'Esc' !== e.key) || a();
    }),
    n.addEventListener('click', a),
    s());
}
function initializeTagPage() {
  const e = document.getElementById('tagResults');
  if (!e) return;
  const t = qs.tag;
  if (!t) return void (window.location.href = '/error-404.html');
  const n = document.getElementById('main-title'),
    s = e.dataset.lang ?? document.documentElement.lang ?? 'pl';
  (n && n.insertAdjacentText('beforeend', ` #${t}`),
    (e.dataset.tag = t),
    loadResultUrls(`/pages/tag/${encodeURIComponent(t)}?lang=${s}`, 'tag').then(
      (t) => renderResultFragments(e, t),
    ));
}
function updateValidationState(e) {
  e.checkValidity()
    ? (e.classList.remove('is-invalid'), e.classList.add('is-valid'))
    : (e.classList.remove('is-valid'), e.classList.add('is-invalid'));
}
function initializeContactForm() {
  const e = document.getElementById('contact-form'),
    t = document.getElementById('contactSubmitBtn');
  if (!e || !t) return;
  const n = e.querySelectorAll('.form-control'),
    s = () => {
      t.disabled = !e.checkValidity();
    };
  (n.forEach((e) => {
    (e.addEventListener('blur', () => {
      (updateValidationState(e), s());
    }),
      e.addEventListener('input', () => {
        ((e.classList.contains('is-valid') ||
          e.classList.contains('is-invalid')) &&
          updateValidationState(e),
          s());
      }));
  }),
    e.addEventListener('change', s),
    s());
}
function handleContactFormResponse(e) {
  const t = document.getElementById('contactModal'),
    n = document.getElementById('contactModalOkLabel'),
    s = document.getElementById('contactModalErrorLabel'),
    a = document.getElementById('contactModalOkBody'),
    o = document.getElementById('contactModalErrorBody'),
    r = document.getElementById('contact-form');
  if (!(t && n && s && a && o && r)) return;
  const c = e.detail.xhr.status,
    i = new bootstrap.Modal(t);
  (c >= 200 && c < 300
    ? (t.addEventListener(
        'hidden.bs.modal',
        function () {
          (r.reset(),
            r.classList.remove('was-validated'),
            r
              .querySelectorAll('.form-control')
              .forEach((e) => e.classList.remove('is-valid', 'is-invalid')));
          const e = document.getElementById('contactSubmitBtn');
          e && (e.disabled = !0);
        },
        { once: !0 },
      ),
      n.classList.remove('d-none'),
      s.classList.add('d-none'),
      a.classList.remove('d-none'),
      o.classList.add('d-none'))
    : (n.classList.add('d-none'),
      s.classList.remove('d-none'),
      a.classList.add('d-none'),
      o.classList.remove('d-none')),
    i.show());
}
(document.body.addEventListener('htmx:afterRequest', function (e) {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  const n = t.dataset.resultsContainer;
  n
    ? handleSearchResponse(e, n)
    : 'contact-form' === t.id && handleContactFormResponse(e);
}),
  initializeTopbarSearch(),
  initializeFullSearch(),
  initializeTagPage(),
  initializeContactForm());
