{% extends "./master.njs" %}

{% block subHeader %}
    <i class="bi-calendar"></i> &nbsp; {{ date }} {% if tags %} &nbsp;&nbsp;&nbsp; {% for tag in tags %} &nbsp; <i class="bi-tag"></i> <a href="/tag/{{ tag }}">{{ tag }}</a> {% endfor %}{% endif %}
{% endblock %}

{% block article %}
    <article class="col-sm-9">
        {% if lead %}
        <div class="lead">{{ lead }}</div>
        {% endif %}
        <div class="content">
        {{ content }}
        </div>
    <block id="blog-pager" type="pageList" template="blog-pager" series="blog" current="{{ slug }}" prev="1" next="1" />
    </article>
{% endblock %}
