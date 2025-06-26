<div id="headerImg"
     class="bg-custom-primary-light"
     style="background-image: url('/ui/gradient-left.png'), url('/ui/gradient-right.png'), url('/media/{{ headerImage }}')"
>
    <h1 class="d-flex flex-wrap align-self-end mb-3">
        {% block mainTitle %}<span id="main-title" class=" me-auto">{{ title }}</span>{% endblock %}
        {% if subtitle %}<span id="subtitle" class="mt-3 ">{{ subtitle }}</span>{% endif %}
    </h1>
</div>
