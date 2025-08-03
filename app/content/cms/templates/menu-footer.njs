{% for column in menu %}
  <div class="col-6 col-lg-2">
    <h5>{{ column.title }}</h5>
    <ul class="list-unstyled">
      {% for item in column.items %}
      <li class="mb-2"><a href="{{ item.url }}">{{ item.title }}</a></li>
      {% endfor %}
    </ul>
  </div>
{% endfor %}