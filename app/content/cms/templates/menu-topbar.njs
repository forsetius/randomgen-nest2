<div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
        {% for topMenuItem in menu %}
            {% if topMenuItem.items %}
                {# SimpleSubMenu #}
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" title="{{ topMenuItem.title }}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ topMenuItem.title }}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        {% for child in topMenuItem.children %}
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
                
                <div class="dropdown-menu dropdown-menu-custom p-3"
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
                          {% if column.text %}<p class="mb-0 small text-body-secondary">{{ column.text }}</p>{% endif %}
                          <div class="row g-3">
                            {% set groups = column.items | splitToColumns(span) %}
                            {% for group in groups %}
                              <div class="col dropdown-item-subcolumn g-3">
                                <ul class="list-unstyled mb-0">
                                  {% for subitem in group %}
                                    <li class="mb-2">
                                      <h6 class="mb-1"><a class="text-decoration-none" href="{{ subitem.url }}">{{ subitem.title }}</a></h6>
                                      {% if subitem.text %}<p class="mb-0 small text-body-secondary">{{ subitem.text }}</p>{% endif %}
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
  
  <form
      id="searchForm"
      class="d-flex ms-auto"
      action="/pages/{{ lang }}/search.html?term={value}"
      method="GET"
      autocomplete="off"
  >
    <div class="position-relative">
        <input
            id="searchInput"
            class="form-control"
            type="search"
            name="term"
            placeholder="{{ translations.search }}..."
            aria-label="Search"
            autocomplete="off"
            hx-get="/search?count=7&brief=true"
            hx-trigger="keyup[this.value.length >= 3] delay:300ms"
            hx-target="#searchResults"
            hx-on:htmx:after-request="handleSearchResponse(event, 'searchResults')"
            hx-swap="none"
        />
      
      <ul
          id="searchResults"
          class="list-group position-absolute d-none w-100 mt-1 bg-body-secondary"
      >
      </ul>
    </div>
  </form>
</div>
