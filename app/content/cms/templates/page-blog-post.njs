{% extends "_master.njs" %}

{% block article %}
    <article class="col-sm-9">
        {% if lead %}
        <div class="lead">{{ lead }}</div>
        {% endif %}
        <div class="content">
        {{ content }}
        </div>
    <block id="pager" type="pageList" template="pager" series="blog" current="{{ slug }}" prev="1" next="1" />
    </article>
{% endblock %}
