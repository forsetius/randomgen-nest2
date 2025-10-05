{% extends "_master.njs" %}

{% block article %}
    {% if lead %}
    <div class="lead">{{ lead }}</div>
    {% endif %}
    {% if slots and slots.aside %}
    <div class="content">
    {% else %}
    <div class="content-wide">
    {% endif %}
        {{ content }}
    </div>
    
    <slot id="bottom" />

    {% if category %}
        {% include "partial-pager.njs" %}
    {% endif %}
{% endblock %}

{% if not slots or not slots.aside %}
    {% block asideOuter %}{% endblock %}
{% endif %}
