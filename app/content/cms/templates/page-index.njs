{% extends "_master.njs" %}
 
{% block bodyClass %}home-page{% endblock %}

{% block article %}
    {{ content }}
    
    <slot id="bottom" />
{% endblock %}
