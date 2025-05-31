<div style="margin-left: 75px">
  <hr>
  <div class="d-flex justify-content-center gap-5 w-75 mx-auto mt-5">
    <!-- Poprzedni -->
    {% if categoryData.prev %}
    <a href="{{ categoryData.prev.filename }}"
       class="btn btn-outline-success d-flex flex-column align-items-start text-start fw-bold p-3 w-50">
      <small class="text-black-50">Poprzedni:</small>
      {{ categoryData.prev.def.title }}
    </a>
    {% endif %}
    
    <!-- Następny -->
    {% if categoryData.next %}
    <a href="{{ categoryData.next.filename }}"
       class="btn btn-outline-success d-flex flex-column align-items-end text-end fw-bold p-3 w-50">
      <small class="text-black-50">Następny:</small>
      {{ categoryData.next.def.title }}
    </a>
    {% endif %}
  </div>
</div>
