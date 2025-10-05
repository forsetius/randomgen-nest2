{% extends "page-default.njs" %}

{% block javascripts %}
    <script>
      (function() {
        const tag = qs.tag ?? '';
        const element = document.getElementById('main-title');
        element.insertAdjacentText('beforeend', ` #${tag}`);
      })();
    </script>
{% endblock %}
