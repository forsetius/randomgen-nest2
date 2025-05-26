{% extends "_master.njs" %}
 
{% block bodyClass %}home-page{% endblock %}
{% block subHeader %}{% endblock %}

{% block article %}
<article class="aside-aware">
    {{ content }}
</article>
{% endblock %}
