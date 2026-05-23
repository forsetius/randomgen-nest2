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
  
  <div class="dropdown theme-switcher">
    <button id="theme-toggle"
            class="btn topbar__icon-button theme-switcher__toggle dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="{{ t('theme') }}"
    >
      <i class="bi bi-moon-stars-fill" aria-hidden="true"></i>
    </button>
    <ul id="theme-menu"
        class="dropdown-menu dropdown-menu-end theme-switcher__menu"
        aria-labelledby="theme-toggle"
    >
      <li>
        <span class="dropdown-header theme-switcher__label">{{ t('theme') }}</span>
      </li>
      <li>
        <button class="dropdown-item theme-switcher__item"
                type="button"
                data-theme-value="light"
        >
          <i class="bi bi-sun-fill" aria-hidden="true"></i>
          <span>{{ t('themeLight') }}</span>
        </button>
      </li>
      <li>
        <button class="dropdown-item theme-switcher__item"
                type="button"
                data-theme-value="dark"
        >
          <i class="bi bi-moon-fill" aria-hidden="true"></i>
          <span>{{ t('themeDark') }}</span>
        </button>
      </li>
      <li>
        <button class="dropdown-item theme-switcher__item"
                type="button"
                data-theme-value="system"
        >
          <i class="bi bi-moon-stars-fill" aria-hidden="true"></i>
          <span>{{ t('themeSystem') }}</span>
        </button>
      </li>
    </ul>
  </div>
</div>
