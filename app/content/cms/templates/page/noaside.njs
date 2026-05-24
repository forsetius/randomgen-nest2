{% extends "include/master.njs" %}
{% set isAsideRight = false %}

{% block article %}
  <div class="content">
    {{ content }}
  </div>
  
  <slot id="bottom" />
{% endblock %}
