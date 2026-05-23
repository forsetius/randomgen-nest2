{% extends "include/master.njs" %}
{% set isAsideRight = true %}

{% block bodyClass %}home-page{% endblock %}

{% block article %}
    <div class="content">
        {{ content }}
    </div>
    
    <slot id="bottom" />
{% endblock %}
