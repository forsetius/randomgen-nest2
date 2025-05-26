{% extends "_master.njs" %}

{% block subHeader %}{% endblock %}

{% block article %}
  <article class="">
    {% if lead %}
      <div class="lead">{{ lead }}</div>
    {% endif %}
    <div class="content">
      {{ content }}
    </div>
    
    <block id="bottom" />
  </article>
{% endblock %}

{% block aside %}{% endblock %}