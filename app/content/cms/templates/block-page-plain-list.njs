<section>
  {% if items | length > 0 %}
    <ul>
    {% for item in items %}
      <li>{{ item }}</li>
    {% endfor %}
    </ul>
  {% endif %}
</section>