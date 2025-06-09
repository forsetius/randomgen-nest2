<form
    id="fullSearchForm"
    action="#"
    method="GET"
    autocomplete="off"
>
    <div class="input-group w-75">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
            id="fullSearchInput"
            class="form-control"
            type="search"
            name="term"
            placeholder="Szukaj..."
            aria-label="Search"
            autocomplete="off"
            hx-get="/search"
            hx-trigger="load, keyup[window.event.target.value.length >= 3] delay:300ms"
            hx-target="#fullSearchResults"
            hx-swap="innerHTML"
        />
        <button
            class="btn btn-outline-secondary"
            type="button"
            id="clearFullSearchBtn"
            aria-label="Clear search"
        >
            <i class="bi bi-x-lg"></i>
        </button>
    </div>
    
    <div id="fullSearchResults" class="w-100 mt-1 row row-cols-1 row-cols-md-3 g-5"></div>
</form>
<script>
    const fullSearchInput = document.getElementById('fullSearchInput');
    const urlParams = new URLSearchParams(location.search);
    const term = urlParams.get('term') || '';
    fullSearchInput.value = term;
    
    const clearBtn = document.getElementById('clearFullSearchBtn');
    clearBtn.addEventListener('click', () => {
        fullSearchInput.value = '';
        document.getElementById('fullSearchResults').innerHTML = '';
    });
</script>