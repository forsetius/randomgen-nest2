<div class="collapse navbar-collapse" id="main-navigation">
  <ul class="navbar-nav mx-xl-auto mb-3 mb-xl-0 gap-xl-4">
    {% for topMenuItem in menu %}
      {% if topMenuItem.items %}
        {# SimpleSubMenu #}
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle"
             href="#"
             id="navbarDropdown{{ loop.index }}"
             role="button"
             title="{{ topMenuItem.title }}"
             data-bs-toggle="dropdown"
             aria-expanded="false">
            {{ topMenuItem.title }}
          </a>
          <div class="dropdown-menu topbar__menu-dropdown" aria-labelledby="navbarDropdown{{ loop.index }}">
            {% for child in topMenuItem.items %}
              <a class="dropdown-item" href="{{ child.url }}" title="{{ child.title }}">{{ child.title }}</a>
            {% endfor %}
          </div>
        </li>
        
        {% elif topMenuItem.columns %}
        {# RichSubMenu #}
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#"
             id="navbarDropdown{{ loop.index }}"
             role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ topMenuItem.title }}
          </a>
          
          <div class="dropdown-menu topbar__menu-dropdown dropdown-menu-custom p-3"
               aria-labelledby="navbarDropdown{{ loop.index }}">
            <div class="row g-3">
              
              {% set totalUnits = 0 %}
              {% for c in topMenuItem.columns %}
                {% set totalUnits = totalUnits + (c.colspan or 1) %}
              {% endfor %}
              
              {% for column in topMenuItem.columns %}
                {% set span = column.colspan or 1 %}
                {% set basis = "(100% / " ~ totalUnits ~ ") * " ~ span %}
                <div class="col dropdown-item-column"
                    {% if span == 1 %}
                      style="flex:0 0 calc(100% / {{ totalUnits }}); max-width:calc(100% / {{ totalUnits }});"
                    {% else %}
                      style="flex:0 0 calc({{ basis }}); max-width:calc({{ basis }});"
                    {% endif %}
                >
                  <h5 class="mb-2">
                    {% if column.url %}
                      <a href="{{ column.url }}">{{ column.title | safe }}</a>
                    {% else %}
                      {{ column.title | safe }}
                    {% endif %}
                  </h5>
                  {% if column.text %}<p class="mb-0 small">{{ column.text }}</p>{% endif %}
                  <div class="row g-3">
                    {% set groups = column.items | splitToColumns(span) %}
                    {% for group in groups %}
                      <div class="col dropdown-item-subcolumn g-3">
                        <ul class="list-unstyled mb-0">
                          {% for subitem in group %}
                            <li class="mb-2">
                              <h6 class="mb-1"><a class="text-decoration-none" href="{{ subitem.url }}">{{ subitem.title }}</a></h6>
                              {% if subitem.text %}<p class="mb-0 small">{{ subitem.text }}</p>{% endif %}
                            </li>
                          {% endfor %}
                        </ul>
                      </div>
                    {% endfor %}
                  </div>
                </div>
              {% endfor %}
            </div>
          </div>
        </li>
        
        {% elif topMenuItem.separator %}
        {# SeparatorMenuItem #}
        <li class="nav-item d-flex align-items-center px-2 text-muted only-web">{{ topMenuItem.separator }}</li>
        
        {% elif topMenuItem.label %}
        {# LabelMenuItem #}
        <li class="label text-muted pl-5 only-web">{{ topMenuItem.label }}<code> </code></li>
      
      {% else %}
        {# SimpleMenuItem #}
        <li class="nav-item">
          <a class="nav-link" href="{{ topMenuItem.url }}" title="{{ topMenuItem.title }}">{{ topMenuItem.title }}</a>
        </li>
      {% endif %}
    {% endfor %}
  </ul>
  
  <form id="searchForm"
        class="search-form d-flex align-items-center ms-xl-4"
        role="search"
        method="get"
        action="/pages/{{ lang }}/search.html"
        autocomplete="off"
  >
    <label class="visually-hidden" for="site-search">{{ t('searchLabel') }}</label>
    <div class="position-relative d-flex align-items-center w-100">
      <input id="site-search"
             class="form-control"
             name="term"
             type="search"
             placeholder="{{ t('search') }}..."
             aria-label="{{ t('searchLabel') }}..."
             autocomplete="off"
             hx-get="/pages/search?count=7&brief=true&lang={{ lang }}"
             hx-trigger="csp-search"
             hx-target="#searchResults"
             data-results-container="searchResults"
             hx-swap="none"
      >
      <button class="btn search-form__button" type="submit" aria-label="Szukaj">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path d="M10.75 5.25a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0-1.75a7.25 7.25 0 1 0 4.49 12.94l3.66 3.66 1.2-1.2-3.66-3.66A7.25 7.25 0 0 0 10.75 3.5Z" fill="currentColor"/>
        </svg>
      </button>
      <ul
          id="searchResults"
          class="list-group position-absolute d-none w-100 mt-1 bg-body-secondary"
      >
      </ul>
    </div>
  </form>
</div>
