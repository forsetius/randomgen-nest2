{% extends "_master.njs" %}

{% block article %}
  <article class="left-page-space right-page-space">
    {% if lead %}
      <div class="lead">{{ lead }}</div>
    {% endif %}
    <div class="content">
      {{ content }}
    </div>
    
    <slot id="bottom" />
  </article>
{% endblock %}

{% block aside %}{% endblock %}