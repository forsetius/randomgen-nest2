<div class="col">
  <a href="/pages/{{ lang }}/{{ filename }}">
    <div class="card bg-body-secondary">
      <div class="card-body p-0 m-0 d-flex flex-column text-white">
        <div class="card-img-wrapper">
          <img src="/media/{{ thumbnailImage }}" alt="">
          <div class="card-img-overlay">
            <div class="position-absolute bottom-0 bg-dark bg-opacity-50 w-100 px-2 py-1">
              <h3 class="card-title">
                {% if date %}<span class="date">{{ dateTime | formatDate(lang) }}</span> {% endif %}{{ title }}
              </h3>
              <div class="card-text">
                {{ excerpt | default('') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>
</div>
