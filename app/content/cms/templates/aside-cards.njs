<h2 class="text-center">{{ title | default('Title') }}</h2>

<div id="card-container"
     data-card-template="{{ cardTemplate }}"
     data-items="{{ items | string }}"
     data-per-page="{{ perPage }}"
     class="g-5"
></div>

<script src="/ui/pager-set.js"></script>