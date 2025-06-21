<h2 class="text-center">{{ title | default('Title') }}</h2>
<div class="gallery-set">
  <div class="card-container"
       data-card-template="{{ cardTemplate }}"
       data-items="{{ items | string }}"
       data-per-page="{{ perPage | default(3) }}"
  ></div>
  <p><a href="/pages/{{ lang }}/{{ category }}.html" class="float-end">Zobacz więcej...</a></p>
</div>