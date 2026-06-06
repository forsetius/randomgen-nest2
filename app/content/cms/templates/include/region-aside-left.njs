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
    
    {% if readingTime %}
    <div class="side-meta__item side-meta__item--tags">
      <dt>{{ t('length' )}}</dt>
      <dd>
        <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
          <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 1.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4Zm.9 2.7v4.15l3.05 2.05-.98 1.45-3.87-2.6V7.5h1.8Z" fill="currentColor"/>
        </svg>
        <span>{{ readingTime }} {{ t('readingTime') }}</span>
      </dd>
    </div>
    {% endif %}
    
    {% if tags and tags |length > 0 %}
      <div class="side-meta__item side-meta__item--tags">
        <dt>{{ t('tags') }}</dt>
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
