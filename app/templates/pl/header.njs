<div id="headerImg" class="bg-custom-primary-light" 
    {% if headerImage is defined %}
        style="background: url('{{ headerImage }}') right center; background-size: cover;"
    {% endif %}>
    <h1>{{ title }}</h1>
</div>
 