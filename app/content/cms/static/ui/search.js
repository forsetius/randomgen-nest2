const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const results = document.getElementById('searchResults');
const overlay = document.getElementById('pageOverlay');

input.addEventListener('input', function () {
  if (this.value.length > 0) {
    overlay.classList.remove('d-none');
  } else {
    overlay.classList.add('d-none');
  }

  if (this.value.length < 3) {
    results.innerHTML = '';
    results.classList.add('d-none');
  } else {
    results.classList.remove('d-none');
  }
});

input.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    this.value = '';
    this.dispatchEvent(new Event('input'));
  }
});

document.addEventListener('click', function (e) {
  if (!form.contains(e.target)) {
    input.value = '';
    input.dispatchEvent(new Event('input'));
  }
});
