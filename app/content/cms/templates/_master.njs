<!DOCTYPE html>
<html lang="{{ lang }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href='https://fonts.googleapis.com/css?family=Unica+One&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Fira+Sans&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Fira+Sans+Condensed&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link id="theme" rel="stylesheet" type="text/css" href="/ui/styles.css" title="theme" />
  <link rel="icon" type="image/x-icon" href="/ui/{{ brand.logo }}" />
  <link rel="alternate" type="application/rss+xml" title="RSS" href="/pages/{{ lang }}/rss.xml" />
  <script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
  <script src="/ui/head.js"></script>
  {% block meta %}
    {% include 'partial-seo-main.njs' %}
    {% include 'partial-seo-og.njs' %}
  {% endblock %}
</head>
<body class="{% block bodyClass %}default-page{% endblock %}">
<div id="pageOverlay" class="d-none"></div>

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
      {% if langs %}
        {% for langVersion, langUrl in langs %}
          <a href="@{{ '{' }}{{ langVersion }}/{{ langUrl }}{{ '}' }}" class="">&nbsp;&nbsp;
            <img
                src="/ui/flag-{{ langVersion }}-1.png"
                srcset="/ui/flag-{{ langVersion }}-2.png 2x, /ui/flag-{{ langVersion }}-3.png 3x"
                width="32"
                height="24"
            >
          </a>
        {% endfor %}
      {% endif %}
    </div>
  </nav>
  {% block header %} {% include "partial-header.njs" %} {% endblock %}
  <div id="subHeader">
    {% block subHeader %}
      <slot id="preSubheader" />
      {% if date %}<span class="info"><i class="bi-calendar3"></i>&nbsp;&nbsp;{{ date }}</span>{% endif %}
      {% if categoryData %}<span class="info"><i class="bi-folder2-open"></i>&nbsp;&nbsp;{{ categoryData.current.breadcrumbs }}</span>{% endif %}
      {% if tags %}<span class="info">{% for tag in tags %}<i class="bi-tag"></i>&nbsp;&nbsp;<a href="/pages/{{ lang }}/tag.html?tag={{ tag }}">{{ tag }}</a> {% endfor %}</span>{% endif %}
      <slot id="postSubheader" />
    {% endblock %}
  </div>
</header>

<main class="container-fluid position-relative">
  <div class="row flex-column flex-lg-row">
  
  {% block asideOuter %}
    {% if slots and slots.aside %}
      <div id="aside-outer" class="order-1 order-lg-2 col-12 col-lg-4">
        <aside class="bg-body-secondary text-light pb-4 rounded-4" data-bs-theme="dark">
          {% block aside %} <slot id="aside" /> {% endblock %}
        </aside>
      </div>
    {% endif %}
  {% endblock %}
  
  {% block articleOuter %}
    {% if lead or content|trim|length > 0 %}
    <article class="order-2 order-lg-1 col-12 col-lg-8">
      {% block article %} {% endblock %}
    </article>
    {% endif %}
  {% endblock %}
  
  </div>
</main>

{% block footer %} {% include "partial-footer.njs" %} {% endblock %}

<!-- compiled and minified JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bs5-lightbox@1.8.5/dist/index.bundle.min.js"></script>
<script src="/ui/search.js"></script>
<script src="/ui/pager-set.js"></script>
{% block javascripts %}{% endblock %}
</body>
</html>