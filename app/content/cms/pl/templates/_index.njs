{% extends "./master.njs" %}
 
{% block bodyClass %}home-page{% endblock %}

{% block article %} 
    <section class="content">
        {{ content }}
    </section>
{% endblock %}

{% block aside %}
    <h2>Na blogu</h2>
    <section id="last-posts"></section>
{% endblock %}
