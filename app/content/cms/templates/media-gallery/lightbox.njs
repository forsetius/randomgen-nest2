<div class="row border-top border-3 border-bottom border-dark-subtle px-1 py-3 mb-3">
{% if items %}
  {% for item in items %}
    {% set src = item.src %}
    {% set title = item.title %}
    {% set gallery = blockId %}
    <div class="col-12 col-md-4">{% include item.template + '.njs' %}</div>
  {% endfor %}
{% elif src %}
  <div class="col-12">
    {% include 'block/lightbox-image.njs' %}
  </div>
{% endif %}
</div>
