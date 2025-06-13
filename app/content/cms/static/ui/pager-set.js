(function () {
  let loadedCount = 0;
  let currentPage = 1;
  let pageLength = 0;

  const container = document.getElementById('card-container');

  const cardTemplate = container.dataset['cardTemplate'] ?? 'fragment-img-card';
  const perPage = parseInt(container.dataset['perPage'] ?? '6', 10);
  const lang = document.querySelector('html').lang || 'pl';

  const fragments = (container.dataset['items'] ?? '')
    .split(',')
    .map((item) => `/pages/${lang}/${cardTemplate}_${item}.html`);

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const totalPages = Math.ceil(fragments.length / perPage);
  const initialPage = Number(qs.page) || 1;

  loadPage(initialPage, false);

  function updateButtons() {
    if (!prevBtn || !nextBtn) return;
    prevBtn.classList.toggle('d-none', currentPage <= 1);
    nextBtn.classList.toggle('d-none', currentPage >= totalPages);
  }

  function loadPage(page, pushHistory = true) {
    page = Math.min(Math.max(1, page), totalPages);
    currentPage = page;

    const start = (currentPage - 1) * perPage;
    const pageFragments = fragments.slice(start, start + perPage);
    pageLength = pageFragments.length;
    loadedCount = 0;

    updateButtons();

    container.style.minHeight = `${container.offsetHeight}px`;
    container.style.opacity = '0';

    function onFadeOut() {
      container.removeEventListener('transitionend', onFadeOut);

      container.innerHTML = '';

      if (pushHistory) {
        history.pushState({ page: currentPage }, '', `?page=${currentPage}`);
      }

      (async () => {
        for (const url of pageFragments) {
          container.insertAdjacentHTML('beforeend', await loadFragment(url));
          loadedCount++;
        }
        container.style.opacity = '1';
        container.style.minHeight = '';
      })();
    }

    container.addEventListener('transitionend', onFadeOut, { once: true });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadPage(currentPage - 1);
    });
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadPage(currentPage + 1);
    });
  }

  window.addEventListener('popstate', (e) => {
    const pg = e.state?.page || 1;
    loadPage(pg, false);
  });
})();
