<h2 class="text-center">{{ title }}</h2>
<div class="gallery-set">
  <div class="card-container"
       data-card-template="{{ cardTemplate }}"
       data-items="{{ items | string }}"
       data-per-page="{{ perPage | default(3) }}"
  ></div>
  <p class="pt-1 pb-3"><a href="/pages/{{ lang }}/{{ category }}.html" class="float-end">{{ translations.seeMore }}...</a></p>
</div>