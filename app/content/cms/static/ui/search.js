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

async function loadFragment(url) {
  try {
    const res = await fetch(url);
    if (res.status === 404) {
      console.warn(`Fragment from ${url} returned 404`);
      return '';
    }
    if (!res.ok) {
      console.error(`Error ${res.status} while loading ${url}`);
      return '';
    }

    return await res.text();
  } catch (e) {
    console.error(`Network error while loading ${url}:`, e);
  }
}

async function handleSearchResponse(event, containerName) {
  const container = document.getElementById(containerName);
  console.log(event);
  let urls;
  try {
    urls = JSON.parse(event.detail.xhr.responseText);
    if (!Array.isArray(urls)) throw 'not an array';
  } catch (err) {
    console.error('Invalid JSON response for search:', err);
    return;
  }

  container.innerHTML = '';
  for (const url of urls) {
    container.insertAdjacentHTML('beforeend', await loadFragment(url));
  }

  container.classList.remove('d-none');
}
