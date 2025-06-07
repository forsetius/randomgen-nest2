<div class="col">
  <a href="/pages/{{ lang }}/{{ filename }}">
    <div class="card bg-body-secondary h-100">
      <div class="card-body p-0 d-flex flex-column text-white">
        <div class="card-img-wrapper">
          <img src="/media/{{ thumbnailImage }}" alt="">
          <div class="card-img-overlay">
            <div class="position-absolute bottom-0 bg-dark bg-opacity-50 w-100 p-1">
              <h3 class="card-title">
                  {{ title }}
              </h3>
              <div class="card-text">
                {{ excerpt | default(lead) | default('') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>
</div>
