{% extends "_master.njs" %}
 
{% block bodyClass %}home-page{% endblock %}
{#{% block subHeader %}{% endblock %}#}

{% block article %}
    {{ content }}
    
    <slot id="bottom" />
{% endblock %}
