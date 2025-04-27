{% extends "./master.njs" %}

{% block article %}
    <article class="col-sm-9">
        {% if lead %}
        <div class="lead">{{ lead }}</div>
        {% endif %}
        <div class="content">
        {{ content }}
        </div>
    <block id="blog-pager" type="pageList" template="blog-pager" current="{{ slug }}" prev="1" next="1" />
    </article>
    
{% endblock %}

{% block aside %}
    {% if slots %}
    <aside class="bg-body-secondary text-light col-sm-3" data-bs-theme="dark">
        <h2 class="text-center">TODO</h2>
        <slot id="aside" />
    </aside>
    {% endif %}
{% endblock %}