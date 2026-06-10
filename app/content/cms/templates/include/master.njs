<!DOCTYPE html>
<html lang="{{ lang }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href='https://fonts.googleapis.com/css?family=Unica+One&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Fira+Sans&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Fira+Sans+Condensed&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
  <link id="theme" rel="stylesheet" type="text/css" href="/ui/styles.css" title="theme" />
  {% block css %}{% endblock %}
  <link rel="icon" type="image/x-icon" href="/ui/{{ brand.logo }}" />
  <link rel="alternate" type="application/rss+xml" title="RSS" href="/pages/{{ lang }}/rss.xml" />
  <meta name="htmx-config" content='{"allowEval":false}'>
  <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.10/dist/htmx.min.js" integrity="sha384-H5SrcfygHmAuTDZphMHqBJLc3FhssKjG7w/CeCpFReSfwBWDTKpkzPP8c+cLsK+V" crossorigin="anonymous"></script>
  <script src="/ui/head.js"></script>
  {% block meta %}
    {% include 'include/seo-main.njs' %}
    {% include 'include/seo-og.njs' %}
  {% endblock %}
</head>
<body class="{% block bodyClass %}default-page{% endblock %}">
<div id="pageOverlay" class="d-none"></div>

<header class="topbar navbar navbar-expand-xl bg-white">
  <div id="topbar-container" class="container-fluid position-relative z-1">
    {% block topbar %} {% include "include/region-topbar.njs" %} {% endblock %}
  </div>
</header>

<main>
  {% block header %} {% include "include/region-hero.njs" %} {% endblock %}
  
  <div class="container-fluid article-shell" id="article-body">
    <div class="row gx-xl-5 gy-5">
    {% block asideLeft %}
      <aside id="aside-left"
             class="aside-left col-lg-3 col-xl-2"
      >
        {% include "include/region-aside-left.njs" %}
      </aside>
    {% endblock %}
    
    <article class="article col">
      {% block article %} {% endblock %}
    </article>
      
    {% block asideRight %}
      <aside class="aside-right col-lg-3 col-xl-4">
        {% if slots and (slots.asideRight or slots.aside) %}
          <div class="d-grid gap-4">
            {% if slots.asideRight %}
              <slot id="asideRight" />
            {% endif %}
            {% if slots.aside %}
              <slot id="aside" />
            {% endif %}
          </div>
        {% endif %}
      </aside>
    {% endblock %}
      
  </div>
  </div>
</main>

<footer class="footer py-3">
  <div class="container-fluid">
  {% block footer %} {% include "include/region-footer.njs" %} {% endblock %}
  </div>
</footer>

<!-- compiled and minified JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bs5-lightbox@1.8.5/dist/index.bundle.min.js"></script>
<script src="/ui/search.js"></script>
<script src="/ui/pager-set.js"></script>
{% block javascripts %}{% endblock %}
</body>
</html>
