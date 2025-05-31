{% extends "_master.njs" %}

{% block article %}
  <article class="">
    {% if lead %}
      <div class="lead">{{ lead }}</div>
    {% endif %}
    <div class="content">
      {{ content }}
    </div>
    
    <slot id="bottom" />
    
    {% if category %}
      {% include "partial-pager.njs" %}
    {% endif %}
  </article>
{% endblock %}

{% block aside %}{% endblock %}