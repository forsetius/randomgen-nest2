{% extends "_master.njs" %}

{% block articleOuter %}
  {% if lead or content|trim|length > 0 %}
    <article class="order-2 order-lg-1 col-12">
    {% if lead %}
      <div class="lead">{{ lead }}</div>
    {% endif %}
    <div class="content3">
      {{ content }}
    </div>
    
    <slot id="bottom" />
    
    {% if category %}
      {% include "partial-pager.njs" %}
    {% endif %}
    </article>
  {% endif %}
{% endblock %}

{% block asideOuter %}{% endblock %}