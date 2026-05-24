  <dl class="side-meta m-0">
    {% if categoryData and categoryData.next %}
      <div class="side-meta__item">
        <dt>{{ t('next') }}</dt>
        <dd>
          <a href="{{ categoryData.next.filename }}">{{ categoryData.next.def.title }}</a>
        </dd>
      </div>
    {% endif %}

    {% if categoryData and categoryData.prev %}
      <div class="side-meta__item">
        <dt>{{ t('previous') }}</dt>
        <dd>
          <a href="{{ categoryData.prev.filename }}">{{ categoryData.prev.def.title }}</a>
        </dd>
      </div>
    {% endif %}
    
    {% if tags and tags |length > 0 %}
      <div class="side-meta__item side-meta__item--tags">
        <dt>Tagi</dt>
        <dd class="d-flex flex-column align-items-start gap-2">
          {% for tag in tags %}
            <a class="side-meta__tag-link" href="/pages/{{ lang }}/tag.html?tag={{ tag }}">
              <i class="bi bi-tag" aria-hidden="true"></i>
              <span>{{ tag }}</span>
            </a>
          {% endfor %}
        </dd>
      </div>
    {% endif %}
  </dl>
