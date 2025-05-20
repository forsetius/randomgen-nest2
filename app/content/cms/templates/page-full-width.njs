{% extends "_master.njs" %}

{% block article %}
  <article class="col-sm-9">
    {% if lead %}
      <div class="lead">{{ lead }}</div>
    {% endif %}
    <div class="content">
      {{ content }}
    </div>
    
    <slot id="bottom" />
  </article>
{% endblock %}