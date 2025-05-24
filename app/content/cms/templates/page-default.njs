{% extends "_master.njs" %}

{% block article %}
<article class="content left-page-space">
    {% if lead %}
    <div class="lead">
        {{ lead }}
    </div>
    {% endif %}
    <div class="content">
        {{ content }}
    </div>
    
    <slot id="bottom" />

    {% if series %}
        <block id="pager" type="pageList" template="pager" series="{{ series }}" current="{{ slug }}" prev="1" next="1" />
    {% endif %}
</article>
{% endblock %}
