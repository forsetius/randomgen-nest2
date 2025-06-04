<h2 class="text-center">{{ title | default('Title') }}</h2>

<div id="card-container"
     data-card-template="{{ cardTemplate }}"
     data-items="{{ items | string }}"
     data-per-page="{{ perPage }}"
></div>
<p><a href="/pages/{{ lang }}/{{ category }}.html" class="float-end">Zobacz więcej...</a></p>

<script src="/ui/pager-set.js"></script>