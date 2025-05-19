{% extends "_master.njs" %}

{% block article %}
    {% if lead %}
    <div class="lead">
        {{ lead }}
    </div>
    {% endif %}
    <div class="content">
        {{ content }}
    </div>

    {% if series %}
        <block id="blog-pager" type="pageList" template="blog-pager" current="{{ slug }}" prev="1" next="1" />
    {% endif %}
{% endblock %}
