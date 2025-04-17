{% extends "master.njs" %}

{% block article %}  
    <section class="content">
        {{ content.article|raw }}
    </section>
{% endblock %}

{% block aside %}
    <section id="aside"></section>
{% endblock %}
