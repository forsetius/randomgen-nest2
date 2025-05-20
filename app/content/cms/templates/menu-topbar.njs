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
                <li class="nav-item d-flex align-items-center px-2 text-muted">{{ topMenuItem.separator }}</li>
                
            {% elif topMenuItem.label %}
                {# LabelMenuItem #}
                <li class="label text-muted pl-5">{{ topMenuItem.label }}<code> </code></li>
                
            {% else %}
                {# SimpleMenuItem #}
                <li class="nav-item">
                    <a class="nav-link" href="{{ topMenuItem.url }}" title="{{ topMenuItem.title }}">{{ topMenuItem.title }}</a>
                </li>
            {% endif %}
        {% endfor %}
    </ul>
</div>
