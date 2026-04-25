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
    return '';
  }
}

const SEARCH_TRIGGER_EVENT = 'csp-search';
const TAG_TRIGGER_EVENT = 'tag-load';
const SEARCH_DEBOUNCE_MS = 300;
const searchRequestTimers = new WeakMap();

function clearResultsContainer(container) {
  container.innerHTML = '';
  container.classList.add('d-none');
}

function scheduleSearchRequest(element) {
  const currentTimer = searchRequestTimers.get(element);

  if (currentTimer) {
    window.clearTimeout(currentTimer);
  }

  const nextTimer = window.setTimeout(() => {
    htmx.trigger(element, SEARCH_TRIGGER_EVENT);
    searchRequestTimers.delete(element);
  }, SEARCH_DEBOUNCE_MS);

  searchRequestTimers.set(element, nextTimer);
}

async function handleSearchResponse(event, containerName) {
  const container = document.getElementById(containerName);

  if (!container) {
    return;
  }

  let urls;
  try {
    urls = JSON.parse(event.detail.xhr.responseText);
    if (!Array.isArray(urls)) {
      throw new Error('Search response payload is not an array.');
    }
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

function initializeTopbarSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const overlay = document.getElementById('pageOverlay');

  if (!form || !input || !results || !overlay) {
    return;
  }

  const resetSearch = () => {
    input.value = '';
    overlay.classList.add('d-none');
    clearResultsContainer(results);
  };

  input.addEventListener('input', function () {
    if (this.value.length > 0) {
      overlay.classList.remove('d-none');
    } else {
      overlay.classList.add('d-none');
    }

    if (this.value.length < 3) {
      clearResultsContainer(results);
      return;
    }

    results.classList.remove('d-none');
    scheduleSearchRequest(this);
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      resetSearch();
    }
  });

  document.addEventListener('click', function (event) {
    if (!form.contains(event.target)) {
      resetSearch();
    }
  });
}

function initializeFullSearch() {
  const input = document.getElementById('fullSearchInput');
  const results = document.getElementById('fullSearchResults');
  const clearButton = document.getElementById('clearFullSearchBtn');

  if (!input || !results || !clearButton) {
    return;
  }

  const updateResults = () => {
    if (input.value.length < 3) {
      clearResultsContainer(results);
      return;
    }

    results.classList.remove('d-none');
    scheduleSearchRequest(input);
  };

  const resetSearch = () => {
    input.value = '';
    clearResultsContainer(results);
  };

  input.value = qs.term ?? '';
  input.addEventListener('input', updateResults);
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      resetSearch();
    }
  });
  clearButton.addEventListener('click', resetSearch);

  updateResults();
}

function initializeTagPage() {
  const container = document.getElementById('tagResults');

  if (!container) {
    return;
  }

  const tag = qs.tag;

  if (!tag) {
    window.location.href = '/error-404.html';
    return;
  }

  const mainTitle = document.getElementById('main-title');
  const lang = container.dataset.lang ?? document.documentElement.lang ?? 'pl';

  if (mainTitle) {
    mainTitle.insertAdjacentText('beforeend', ` #${tag}`);
  }

  container.dataset.tag = tag;
  container.setAttribute(
    'hx-get',
    `/tag/${encodeURIComponent(tag)}?lang=${lang}`,
  );
  htmx.trigger(container, TAG_TRIGGER_EVENT);
}

function updateValidationState(input) {
  if (input.checkValidity()) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
}

function initializeContactForm() {
  const form = document.getElementById('contact-form');
  const submitButton = document.getElementById('contactSubmitBtn');

  if (!form || !submitButton) {
    return;
  }

  const inputs = form.querySelectorAll('.form-control');
  const toggleSubmit = () => {
    submitButton.disabled = !form.checkValidity();
  };

  inputs.forEach((input) => {
    input.addEventListener('blur', () => {
      updateValidationState(input);
      toggleSubmit();
    });
    input.addEventListener('input', () => {
      if (
        input.classList.contains('is-valid') ||
        input.classList.contains('is-invalid')
      ) {
        updateValidationState(input);
      }

      toggleSubmit();
    });
  });

  form.addEventListener('change', toggleSubmit);
  toggleSubmit();
}

function handleContactFormResponse(event) {
  const modal = document.getElementById('contactModal');
  const modalTitleOk = document.getElementById('contactModalOkLabel');
  const modalTitleError = document.getElementById('contactModalErrorLabel');
  const modalBodyOk = document.getElementById('contactModalOkBody');
  const modalBodyError = document.getElementById('contactModalErrorBody');
  const form = document.getElementById('contact-form');

  if (
    !modal ||
    !modalTitleOk ||
    !modalTitleError ||
    !modalBodyOk ||
    !modalBodyError ||
    !form
  ) {
    return;
  }

  const status = event.detail.xhr.status;
  const modalInstance = new bootstrap.Modal(modal);

  if (status >= 200 && status < 300) {
    modal.addEventListener(
      'hidden.bs.modal',
      function () {
        form.reset();
        form.classList.remove('was-validated');
        form
          .querySelectorAll('.form-control')
          .forEach((input) => input.classList.remove('is-valid', 'is-invalid'));

        const submitButton = document.getElementById('contactSubmitBtn');

        if (submitButton) {
          submitButton.disabled = true;
        }
      },
      { once: true },
    );

    modalTitleOk.classList.remove('d-none');
    modalTitleError.classList.add('d-none');
    modalBodyOk.classList.remove('d-none');
    modalBodyError.classList.add('d-none');
  } else {
    modalTitleOk.classList.add('d-none');
    modalTitleError.classList.remove('d-none');
    modalBodyOk.classList.add('d-none');
    modalBodyError.classList.remove('d-none');
  }

  modalInstance.show();
}

document.body.addEventListener('htmx:afterRequest', function (event) {
  const targetElement = event.target;

  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const resultsContainerName = targetElement.dataset.resultsContainer;

  if (resultsContainerName) {
    void handleSearchResponse(event, resultsContainerName);
    return;
  }

  if (targetElement.id === 'contact-form') {
    handleContactFormResponse(event);
  }
});

initializeTopbarSearch();
initializeFullSearch();
initializeTagPage();
initializeContactForm();
