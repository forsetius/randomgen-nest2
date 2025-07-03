<div id="{{ blockId }}" class="gallery-set">
  <div data-card-template="{{ cardTemplate }}"
       data-items="{{ items | string }}"
       data-per-page="{{ perPage | default(3) }}"
       class="card-container row row-cols-1 row-cols-md-{{ perRow }} g-4"
  ></div>
  
  <hr>
  <div class="d-flex justify-content-center gap-5 w-75 mx-auto mt-5">
    <a href="#"
       data-page="prev"
       class="prev-btn btn btn-outline-success d-flex flex-column align-items-start text-start fw-bold p-3 w-50">
      ‹ {{ translations.previous }}
    </a>
    
    <a href="#"
       data-page="next"
       class="next-btn btn btn-outline-success d-flex flex-column align-items-end text-end fw-bold p-3 w-50">
      {{ translations.next }} ›
    </a>
  </div>
</div>
