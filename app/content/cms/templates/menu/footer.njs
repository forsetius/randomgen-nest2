<div class="row row-cols-2 row-cols-md-3 gy-4 footer__menu">
{% for column in menu %}
  <section class="col footer__group">
    <h2 class="h6 mb-2">{{ column.title }}</h2>
    {% for item in column.items %}
      <a href="{{ item.url }}">{{ item.title }}</a>
    {% endfor %}
  </section>
{% endfor %}
</div>
