<section>
  <h2>{{ title }}</h2>
  <div class="gallery-set">
    <div class="card-container"
         data-card-template="{{ cardTemplate }}"
         data-items="{{ items | string }}"
         data-per-page="{{ perPage | default(3) }}"
    ></div>
  </div>
</section>
