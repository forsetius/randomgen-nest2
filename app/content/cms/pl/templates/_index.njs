{% extends "./master.njs" %}
 
{% block bodyClass %}home-page{% endblock %}

{% block article %} 
    <article class="content col-sm-9">
        {{ content }}
    </article>
{% endblock %}

{% block aside %}
    <aside class="bg-body-secondary col-sm-3" data-bs-theme="dark">
        <h2 class="text-center">Ostatnie wpisy</h2>
        <section id="last-posts"></section>
    </aside>
{% endblock %}
