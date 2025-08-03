class GalleryBlock {
  loadedCount = 0;
  currentPage = 1;
  pageLength = 0;

  constructor(blockElement, lang) {
    this.lang = lang;
    this.container = blockElement.querySelector('.card-container');
    this.pagerButtons = blockElement.querySelector('.pager-buttons');
    this.prevBtn = blockElement.querySelector('.prev-btn');
    this.nextBtn = blockElement.querySelector('.next-btn');

    const cardTemplate =
      this.container.dataset['cardTemplate'] ?? 'fragment-img-card';
    this.perPage = parseInt(this.container.dataset['perPage'] ?? '6', 10);

    this.fragments = (this.container.dataset['items'] ?? '')
      .split(',')
      .map((item) => `/pages/${lang}/${cardTemplate}_${item}.html`);

    this.totalPages = Math.ceil(this.fragments.length / this.perPage);
    const initialPage = Number(qs.page) || 1;

    if (this.prevBtn && this.nextBtn) {
      if (this.totalPages === 1) {
        this.pagerButtons.classList.remove('d-flex');
        this.pagerButtons.classList.add('d-none');
      } else {
        this.prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.loadPage(this.currentPage - 1);
        });
        this.nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.loadPage(this.currentPage + 1);
        });
      }
    }

    this.loadPage(initialPage, false);

    window.addEventListener('popstate', (e) => {
      const pg = e.state?.page || 1;
      this.loadPage(pg, false);
    });
  }

  updateButtons() {
    if (!this.prevBtn || !this.nextBtn) return;
    this.prevBtn.classList.toggle('invisible', this.currentPage <= 1);
    this.nextBtn.classList.toggle(
      'invisible',
      this.currentPage >= this.totalPages,
    );
  }

  loadPage(page, pushHistory = true) {
    page = Math.min(Math.max(1, page), this.totalPages);
    this.currentPage = page;

    const start = (this.currentPage - 1) * this.perPage;
    const pageFragments = this.fragments.slice(start, start + this.perPage);
    this.pageLength = pageFragments.length;
    this.loadedCount = 0;

    this.updateButtons();

    this.container.style.minHeight = `${this.container.offsetHeight}px`;
    this.container.style.opacity = '0';

    const onFadeOut = () => {
      this.container.removeEventListener('transitionend', onFadeOut);
      this.container.innerHTML = '';

      if (pushHistory) {
        history.pushState(
          { page: this.currentPage },
          '',
          `?page=${this.currentPage}`,
        );
      }

      (async () => {
        for (const url of pageFragments) {
          this.container.insertAdjacentHTML(
            'beforeend',
            await loadFragment(url),
          );
          this.loadedCount++;
        }
        this.container.style.opacity = '1';
        this.container.style.minHeight = '';
      })();
    };

    this.container.addEventListener('transitionend', onFadeOut, {
      once: true,
    });
  }
}

(function () {
  const lang = document.querySelector('html').lang || 'pl';
  const blockElements = document.querySelectorAll('.gallery-set');

  const blocks = [];
  blockElements.forEach((block) => {
    blocks.push(new GalleryBlock(block, lang));
  });
})();
