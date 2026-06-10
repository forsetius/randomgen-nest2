{% extends "include/master.njs" %}

{% block article %}
  <div class="content two-columns">
    {{ content }}
  </div>
  
  <slot id="bottom" />
{% endblock %}

{% block asideRight %}{% endblock %}
