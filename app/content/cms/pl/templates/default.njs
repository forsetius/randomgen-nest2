{% extends "./master.njs" %}

{% block article %}
    {% if lead %}
    <div class="lead">{{ lead }}</div>
    {% endif %}
    <div class="content">
    {{ content }}
    </div>
{% endblock %}
