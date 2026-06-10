{% extends "include/master.njs" %}

{% block article %}
    <div class="content">
        {{ content }}
    </div>
    
    <slot id="bottom" />
{% endblock %}
