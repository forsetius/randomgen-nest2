<div id="fullSearchForm">
    <div class="input-group w-75">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
            id="fullSearchInput"
            class="form-control"
            type="search"
            name="term"
            placeholder="{{ t('search') }}..."
            aria-label="Search"
            autocomplete="off"
            hx-get="/search?lang={{ lang }}"
            hx-trigger="csp-search"
            hx-include="#fullSearchInput"
            data-results-container="fullSearchResults"
            hx-swap="none"
        />
        <button
            id="clearFullSearchBtn"
            class="btn btn-outline-secondary"
            type="button"
            aria-label="Clear search"
        >
            <i class="bi bi-x-lg"></i>
        </button>
    </div>
    {% if content %}
    <h2>{{ content }}</h2>
    {% endif %}
    <div id="fullSearchResults" class="w-100 mt-1 row row-cols-1 row-cols-md-3 g-5"></div>
</div>
