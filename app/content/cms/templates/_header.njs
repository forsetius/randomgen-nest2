{% if headerImage is defined %}
    {% set picture = headerImage %}
{% else %}
    {% set picture = 'matrix-head.jpg' %}
{% endif %}

<div id="headerImg"
     class="bg-custom-primary-light"
     style="background-image: url('/ui/gradient-left.png'), url('/ui/gradient-right.png'), url('/media/{{ picture }}')"
>
    <h1>{{ title }}</h1>
</div>
 