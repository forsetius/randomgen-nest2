<div class="row">
{% for item in items %}
  {% set src = item.src %}
  {% set title = item.title %}
  {% set gallery = item.blockId %}
  <div class="col-12 col-md-4">{% include item.template + '.njs' %}</div>
{% endfor %}
</div>