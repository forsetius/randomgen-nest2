<div id="fullSearchForm">
    <div class="input-group w-75">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
            id="fullSearchInput"
            class="form-control"
            type="search"
            name="term"
            placeholder="{{ translations.search }}..."
            aria-label="Search"
            autocomplete="off"
            hx-get="/search"
            hx-trigger="load[this.value.length >= 3], keyup[this.value.length >= 3] delay:300ms"
            hx-include="#fullSearchInput"
            hx-on:htmx:after-request="handleSearchResponse(event, 'fullSearchResults')"
            hx-swap="none"
        />
        <button
            id="clearFullSearchBtn"
            class="btn btn-outline-secondary"
            type="button"
            aria-label="Clear search"
            hx-on:click="
                fullSearchInput.value = '';
                fullSearchResults.innerHTML = '';
                fullSearchResults.classList.add('d-none');
            "
        >
            <i class="bi bi-x-lg"></i>
        </button>
    </div>
    
    <div id="fullSearchResults" class="w-100 mt-1 row row-cols-1 row-cols-md-3 g-5"></div>
</div>

{% block javascript %}
<script>
    document.getElementById('fullSearchInput').value = qs.term
</script>
{% endblock %}