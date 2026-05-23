<div class="row row-cols-2 row-cols-md-4 gy-4">
{% for column in menu %}
  <section class="col footer__group">
    <h2 class="h6 mb-2">{{ column.title }}</h2>
    {% for item in column.items %}
      <a href="{{ item.url }}">{{ item.title }}</a>
    {% endfor %}
  </section>
{% endfor %}
</div>
