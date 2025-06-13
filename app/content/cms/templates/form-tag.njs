<div
    id="tagResults"
    class="w-100 mt-1 row row-cols-1 row-cols-md-3 g-5 d-none"
    data-tag=""
    hx-trigger="load"
    hx-swap="none"
    hx-on:htmx:after-request="handleSearchResponse(event, 'tagResults')"
></div>

<script>
  (()=>{
    if (!qs.tag) {
      window.location.href="/error-404.html";
    }
    const container = document.getElementById('tagResults');
    container.setAttribute('hx-get', `/tag/${encodeURIComponent(qs.tag)}`);
    htmx.trigger(container, 'load');
  })();
</script>
