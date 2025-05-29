{% if headerImage is defined %}
    {% set picture = headerImage %}
{% else %}
    {% set picture = 'matrix-head.jpg' %}
{% endif %}

<div id="headerImg"
     class="bg-custom-primary-light"
     style="background-image: url('/ui/gradient-left.png'), url('/ui/gradient-right.png'), url('/media/{{ picture }}')"
>
    <h1 class="d-flex justify-content-between flex-nowrap m-0 left-page-space">
        <span class="main-title">{{ title }}</span>
        {% if subtitle %}<span class="subtitle right-page-space">{{ subtitle }}</span>{% endif %}
    </h1>
</div>
