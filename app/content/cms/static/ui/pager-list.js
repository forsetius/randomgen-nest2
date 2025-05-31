(function () {
  let loadedCount = 0;
  let currentPage = 1;
  const perPage = 6;
  const container = document.getElementById('card-container');
  const category = container.dataset['category'];
  const cardTemplate = container.dataset['cardTemplate'] ?? 'img-card';
  const lang = document.getElementsByTagName('html').item(0).lang;
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  function getPageName(idx) {
    return `/pages/${lang}/${cardTemplate}_${category}_${idx}.html`;
  }

  function loadOneCard(idx) {
    const url = getPageName(idx);
    htmx.ajax('GET', url, {
      target: '#card-container',
      swap: 'beforeend',
      indicator: '#spinner',
    });
  }

  function updateButtons() {
    prevBtn.classList.toggle('d-none', currentPage <= 1);

    nextBtn.classList.add('d-none');
    const startIdx = currentPage * perPage + 1;
    fetch(getPageName(startIdx), { method: 'HEAD' })
      .then((res) => {
        nextBtn.classList.toggle('d-none', !res.ok);
      })
      .catch(() => {
        nextBtn.classList.add('d-none');
      });
  }

  function loadPage(page, pushHistory = true) {
    page = Math.max(1, page);
    currentPage = page;
    loadedCount = 0;
    updateButtons();

    const h = container.offsetHeight;
    container.style.minHeight = `${h}px`;
    container.style.opacity = '0';

    const onFadeOut = () => {
      container.removeEventListener('transitionend', onFadeOut);
      container.innerHTML = '';
      if (pushHistory) {
        history.pushState({ page: currentPage }, '', `?page=${currentPage}`);
      }
      loadOneCard((currentPage - 1) * perPage + 1);
    };
    container.addEventListener('transitionend', onFadeOut, { once: true });
  }

  document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.detail.target.id !== 'card-container') return;
    loadedCount++;
    if (loadedCount < perPage) {
      loadOneCard((currentPage - 1) * perPage + loadedCount + 1);
    } else {
      container.style.opacity = '1';
      container.style.minHeight = '';
    }
  });

  document.body.addEventListener('htmx:responseError', (evt) => {
    if (
      evt.detail.target.id === 'card-container' &&
      evt.detail.xhr.status === 404
    ) {
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

  document.addEventListener('DOMContentLoaded', () => {
    const q = Number(new URLSearchParams(location.search).get('page')) || 1;
    loadPage(q, false);
  });
})();
