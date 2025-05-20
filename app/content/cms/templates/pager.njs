<div style="margin-left: 75px">
  <hr>
  <div class="d-flex justify-content-center gap-5 w-75 mx-auto mt-5">
    <!-- Poprzedni -->
    {% if pages.prev[0] %}
    <a href="{{ pages.prev[0].htmlFilename }}"
       class="btn btn-outline-success d-flex flex-column align-items-start text-start fw-bold p-3 w-50">
      <small class="text-black-50">Poprzedni:</small>
      {{ pages.prev[0].title }}
    </a>
    {% endif %}
    
    <!-- Następny -->
    {% if pages.next[0] %}
    <a href="{{ pages.next[0].htmlFilename }}"
       class="btn btn-outline-success d-flex flex-column align-items-end text-end fw-bold p-3 w-50">
      <small class="text-black-50">Następny:</small>
      {{ pages.next[0].title }}
    </a>
    {% endif %}
  </div>
</div>
