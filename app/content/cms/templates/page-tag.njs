{% extends "_master.njs" %}

{% block subHeader %}{% endblock %}

{% block article %}
    {% if lead %}
      <div class="lead">{{ lead }}</div>
    {% endif %}
    <div class="content">
      {{ content }}
    </div>
    
    <block id="bottom" />
{% endblock %}

{% block aside %}{% endblock %}