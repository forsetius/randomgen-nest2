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
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown{{ loop.index }}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {{ topMenuItem.title }}
                </a>
                <ul class="dropdown-menu dropdown-menu-custom p-3" aria-labelledby="navbarDropdown{{ loop.index }}">
                  <div class="d-flex">
                  {% for column in topMenuItem.columns %}
                    <li class="dropdown-item-column">
                      <h5><a href="{{ column.url|default('#') }}">{{ column.title }}</a></h5>
                      <ul class="list-unstyled">
                        {% for subitem in column.items %}
                          <li>
                            <h6><a href="{{ subitem.url }}">{{ subitem.title }}</a></h6>
                            <p>{{ subitem.text }}</p>
                          </li>
                        {% endfor %}
                      </ul>
                    </li>
                  {% endfor %}
                  </div>
                </ul>
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
      action="/pages/pl/search.html?term={value}"
      method="GET"
      autocomplete="off"
  >
    <div class="position-relative">
      <div class="input-group">
        <input
            id="searchInput"
            class="form-control"
            type="search"
            name="term"
            placeholder="Szukaj..."
            aria-label="Search"
            autocomplete="off"
            hx-get="/search/7"
            hx-trigger="keyup[window.event.target.value.length >= 3] delay:300ms"
            hx-target="#searchResults"
            hx-swap="innerHTML"
        />
        <button class="btn btn-outline-success" type="submit">
          <i class="bi bi-search"></i>
        </button>
      </div>
      
      <ul
          id="searchResults"
          class="list-group position-absolute d-none w-100 mt-1 bg-body-secondary"
      >
      </ul>
    </div>
  </form>
</div>