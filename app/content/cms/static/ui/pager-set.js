(function () {
  let loadedCount = 0;
  let currentPage = 1;
  const perPage = 6;
  let pageLength = 0;

  const container = document.getElementById('card-container');

  const cardTemplate = container.dataset['cardTemplate'] ?? 'fragment-img-card';
  const lang = document.getElementsByTagName('html').item(0).lang;
  const fragments = (container.dataset['items'] ?? '')
    .split(',')
    .map((item) => `/pages/${lang}/${cardTemplate}_${item}.html`);
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const totalPages = Math.ceil(fragments.length / perPage);

  const initialPage =
    Number(new URLSearchParams(location.search).get('page')) || 1;
  loadPage(initialPage, false);

  function updateButtons() {
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

    const onFadeOut = async () => {
      container.removeEventListener('transitionend', onFadeOut);
      container.innerHTML = '';
      if (pushHistory) {
        history.pushState({ page: currentPage }, '', `?page=${currentPage}`);
      }
      for (const url of pageFragments) {
        await htmx.ajax('GET', url, {
          target: '#card-container',
          swap: 'beforeend',
        });
      }
    };
    container.addEventListener('transitionend', onFadeOut, { once: true });
  }

  document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.detail.target.id !== 'card-container') return;
    loadedCount++;
    if (loadedCount === pageLength) {
      container.style.opacity = '1';
      container.style.minHeight = '';
    }
  });

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loadPage(currentPage - 1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loadPage(currentPage + 1);
  });

  window.addEventListener('popstate', (e) => {
    loadPage(e.state?.page || 1, false);
  });
})();
