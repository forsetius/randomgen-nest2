<div id="headerImg"
     class="bg-custom-primary-light"
     style="background-image: url('/ui/gradient-left.png'), url('/ui/gradient-right.png'), url('/media/{{ headerImage }}')"
>
    <h1 class="d-flex justify-content-between flex-nowrap m-0">
        {% block mainTitle %}<span id="main-title">{{ title }}</span>{% endblock %}
        {% if subtitle %}<span id="subtitle">{{ subtitle }}</span>{% endif %}
    </h1>
</div>
