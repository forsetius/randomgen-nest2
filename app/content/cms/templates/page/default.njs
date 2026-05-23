{% extends "include/master.njs" %}
{% set isAsideRight = true %}

{% block article %}
    <div class="content">
        {{ content }}
    </div>
    
    <slot id="bottom" />
{% endblock %}
