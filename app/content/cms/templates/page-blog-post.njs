{% extends "_master.njs" %}

{% block article %}
    <article class="col-sm-9 left-page-space">
        {% if lead %}
        <div class="lead">{{ lead }}</div>
        {% endif %}
        <div class="content">
        {{ content }}
        </div>
        
        {% include "partial-pager.njs" %}
    </article>
{% endblock %}
