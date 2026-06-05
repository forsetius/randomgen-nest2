{% extends "include/master.njs" %}
{% set isAsideRight = false %}

{% block article %}
  <div class="content two-columns">
    {{ content }}
  </div>
  
  <slot id="bottom" />
{% endblock %}
