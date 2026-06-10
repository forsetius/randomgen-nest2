  <dl class="side-meta m-0">
    {% if categoryData and categoryData.next %}
      <div class="side-meta__item side-meta__item--next">
        <i class="side-meta__icon bi bi-arrow-right-circle" aria-hidden="true"></i>
        <dt>{{ t('next') }}</dt>
        <dd>
          <a href="{{ categoryData.next.filename }}">{{ categoryData.next.def.title }}</a>
        </dd>
      </div>
    {% endif %}

    {% if categoryData and categoryData.prev %}
      <div class="side-meta__item side-meta__item--previous">
        <i class="side-meta__icon bi bi-arrow-left-circle" aria-hidden="true"></i>
        <dt>{{ t('previous') }}</dt>
        <dd>
          <a href="{{ categoryData.prev.filename }}">{{ categoryData.prev.def.title }}</a>
        </dd>
      </div>
    {% endif %}
    
    {% if readingTime %}
    <div class="side-meta__item side-meta__item--reading-time">
      <i class="side-meta__icon bi bi-clock" aria-hidden="true"></i>
      <dt>{{ t('length' )}}</dt>
      <dd>
        <span>{{ readingTime }} {{ t('readingTime') }}</span>
      </dd>
    </div>
    {% endif %}
    
    {% if tags and tags |length > 0 %}
      <div class="side-meta__item side-meta__item--tags">
        <i class="side-meta__icon bi bi-tags" aria-hidden="true"></i>
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
