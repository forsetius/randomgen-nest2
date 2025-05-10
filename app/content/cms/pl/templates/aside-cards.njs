<h2 class="text-center">{{ title }}</h2>
{% for item in pages.all %}
<div class="card bg-body-secondary">
  <div class="card-body text-white">
    <img src="/static/media/{{ item.thumbnailImage }}" class="card-img-top" alt="...">
    <div class="card-img-overlay">
      <div class="position-absolute bottom-0 bg-dark bg-opacity-50">
        <h3 class="card-title"><a href="/page/{{ item.slug }}">{{ item.title }}</a></h3>
        <p class="card-text">{{ item.excerpt | default(item.lead) | default('') }}</p>
      </div>
    </div>
  </div>
</div>
{% endfor %}