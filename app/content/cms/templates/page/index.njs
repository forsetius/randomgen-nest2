{% extends "include/master.njs" %}

{% block bodyClass %}home-page{% endblock %}

{% block asideLeft %}{% endblock %}

{% block article %}
    <div class="content">
        {{ content }}
    </div>
    
    <slot id="bottom" />
{% endblock %}
