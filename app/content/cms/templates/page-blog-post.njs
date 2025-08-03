{% extends "_master.njs" %}

{% block article %}
    {% if lead %}
    <div class="lead">{{ lead }}</div>
    {% endif %}
    <div class="content">
    {{ content }}
    </div>
    
    {% include "partial-pager.njs" %}
{% endblock %}
