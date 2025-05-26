<div id="card-container" data-series="{{ series }}" data-card-template="{{ cardTemplate }}" class="row row-cols-1 row-cols-md-3 g-5"></div>

<div id="spinner" style="display:none" class="position-absolute top-50 start-50">
  <div class="spinner-border"></div>
</div>
<hr>
<div class="d-flex justify-content-center gap-5 w-75 mx-auto mt-5">
  <a href="#"
     id="prev-btn"
     data-page="prev"
     class="btn btn-outline-success d-flex flex-column align-items-start text-start fw-bold p-3 w-50">
    ‹ Poprzednie
  </a>
  
  <a href="#"
     id="next-btn"
     data-page="next"
     class="btn btn-outline-success d-flex flex-column align-items-end text-end fw-bold p-3 w-50">
    Następne ›
  </a>
</div>

<script src="/ui/pager-list.js"></script>