<!DOCTYPE html>
<html lang="{{ lang }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forseti - Abstract Works</title>
  <link href='https://fonts.googleapis.com/css?family=Fira+Sans+Condensed&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Unica+One&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Fira+Sans&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <meta name="robots" content="index,follow"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link id="theme" rel="stylesheet" type="text/css" href="/ui/styles.css" title="theme" />
  {% block style %}{% endblock %}
  <link rel="icon" type="image/x-icon" href="/ui/{{ brand.logo }}" />
  <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
</head>
<body class="{% block bodyClass %}default-page{% endblock %}">
<header>
  <nav id="topbar-nav" class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="/pages/{{ lang }}/index.html">
        <img src="/ui/{{ brand.logo }}" alt="Logo" width="32" height="32" class="d-inline-block align-text-middle">
        <span>{{ brand.name }}</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <menu id="topbar" />
    </div>
  </nav>
  {% block header %} {% include "partial_header.njs" %} {% endblock %}
  <div id="subHeader" class="left-page-space right-page-space">
    {% block subHeader %}
      {% if date %}<span class="info"><i class="bi-calendar3"></i>&nbsp; {{ date }}</span>{% endif %}
      {% if categoryData %}<span class="info"><i class="bi-folder2-open"></i> {{ categoryData.current.breadcrumbs }}</span>{% endif %}
      {% if tags %}<span class="info">{% for tag in tags %}<i class="bi-tag"></i> <a href="/pages/{{ lang }}/tag-{{ tag }}.html">{{ tag }}</a> {% endfor %}</span>{% endif %}
    {% endblock %}
  </div>
</header>

<main>
  {% block aside %}
    {% if slots and slots.aside %}
    <aside class="bg-body-secondary text-light col-sm-3" data-bs-theme="dark">
      <slot id="aside" />
    </aside>
    {% endif %}
  {% endblock %}
  
  {% block article %} {% endblock %}
</main>

{% block footer %} {% include "partial_footer.njs" %} {% endblock %}

<!-- compiled and minified JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bs5-lightbox@1.8.5/dist/index.bundle.min.js"></script>
{% block javascripts %}{% endblock %}
</body>
</html>