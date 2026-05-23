class GalleryBlock {
  loadedCount = 0;
  currentPage = 1;
  pageLength = 0;
  constructor(t, e) {
    ((this.lang = e),
      (this.container = t.querySelector('.card-container')),
      (this.pagerButtons = t.querySelector('.pager-buttons')),
      (this.prevBtn = t.querySelector('.prev-btn')),
      (this.nextBtn = t.querySelector('.next-btn')));
    const n = this.container.dataset.cardTemplate ?? 'fragment/card';
    ((this.perPage = parseInt(this.container.dataset.perPage ?? '6', 10)),
      (this.fragments = (this.container.dataset.items ?? '')
        .split(',')
        .map((t) => `/pages/${e}/${n}_${t}.html`)),
      (this.totalPages = Math.ceil(this.fragments.length / this.perPage)));
    const s = Number(qs.page) || 1;
    (this.prevBtn &&
      this.nextBtn &&
      (1 === this.totalPages
        ? (this.pagerButtons.classList.remove('d-flex'),
          this.pagerButtons.classList.add('d-none'))
        : (this.prevBtn.addEventListener('click', (t) => {
            (t.preventDefault(), this.loadPage(this.currentPage - 1));
          }),
          this.nextBtn.addEventListener('click', (t) => {
            (t.preventDefault(), this.loadPage(this.currentPage + 1));
          }))),
      this.loadPage(s, !1),
      window.addEventListener('popstate', (t) => {
        const e = t.state?.page || 1;
        this.loadPage(e, !1);
      }));
  }
  updateButtons() {
    this.prevBtn &&
      this.nextBtn &&
      (this.prevBtn.classList.toggle('invisible', this.currentPage <= 1),
      this.nextBtn.classList.toggle(
        'invisible',
        this.currentPage >= this.totalPages,
      ));
  }
  getTransitionTimeoutMs() {
    const t = window.getComputedStyle(this.container),
      e = (t) => {
        const e = t.trim();
        return e.endsWith('ms')
          ? Number.parseFloat(e.slice(0, -2))
          : e.endsWith('s')
            ? 1e3 * Number.parseFloat(e.slice(0, -1))
            : 0;
      },
      n = t.transitionDuration.split(',').map(e),
      s = t.transitionDelay.split(',').map(e);
    return Math.max(...n.map((t, e) => t + (s[e] ?? 0)), 0);
  }
  loadPage(t, e = !0) {
    ((t = Math.min(Math.max(1, t), this.totalPages)), (this.currentPage = t));
    const n = (this.currentPage - 1) * this.perPage,
      s = this.fragments.slice(n, n + this.perPage);
    ((this.pageLength = s.length),
      (this.loadedCount = 0),
      this.updateButtons(),
      (this.container.style.minHeight = `${this.container.offsetHeight}px`),
      (this.container.style.opacity = '0'));
    const i = () => {
      (this.container.removeEventListener('transitionend', i),
        (this.container.innerHTML = ''),
        e &&
          history.pushState(
            { page: this.currentPage },
            '',
            `?page=${this.currentPage}`,
          ),
        (async () => {
          for (const t of s)
            (this.container.insertAdjacentHTML(
              'beforeend',
              await loadFragment(t),
            ),
              this.loadedCount++);
          ((this.container.style.opacity = '1'),
            (this.container.style.minHeight = ''));
        })());
    };
    this.getTransitionTimeoutMs() <= 0
      ? i()
      : this.container.addEventListener('transitionend', i, { once: !0 });
  }
}
!(function () {
  const t = document.querySelector('html').lang || 'pl',
    e = document.querySelectorAll('.gallery-set'),
    n = [];
  e.forEach((e) => {
    n.push(new GalleryBlock(e, t));
  });
})();
