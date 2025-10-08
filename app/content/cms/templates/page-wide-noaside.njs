{% extends "_master.njs" %}

{% block article %}
    {% if lead %}
    <div class="lead">{{ lead }}</div>
    {% endif %}
    {{ content }}
    
    <slot id="bottom" />

    {% if category %}
        {% include "partial-pager.njs" %}
    {% endif %}
{% endblock %}
