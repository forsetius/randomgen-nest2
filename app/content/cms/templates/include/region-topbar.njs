<a class="navbar-brand brand d-flex align-items-center gap-3 me-xl-5" href="/pages/{{ lang }}/index.html">
  <img class="brand__logo" src="/ui/{{ brand.logo }}" alt="Logo" width="56" height="56">
  <span class="brand__name">{{ brand.name }}</span>
</a>

<button
    class="navbar-toggler ms-auto"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#main-navigation"
    aria-controls="main-navigation"
    aria-expanded="false"
>
  <span class="navbar-toggler-icon"></span>
</button>

<menu id="topbar" />

<div class="topbar__actions d-flex align-items-center gap-2">
  {% if langs %}
    <div class="topbar__lang-switch d-flex align-items-center gap-2">
      {% for langVersion, langUrl in langs %}
        <a class="topbar__lang-link" href="@{{ '{' }}{{ langVersion }}/{{ langUrl }}{{ '}' }}">
          {{ langVersion | upper }}
        </a>
      {% endfor %}
    </div>
  {% endif %}
</div>
