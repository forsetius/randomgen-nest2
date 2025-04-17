<div class="collapse navbar-collapse " id="navbarNavDropdown">
    <ul class="navbar-nav mt-2 mt-lg-0">
        {% for topMenuItem in menu %}
            {% if topMenuItem.items %}
                {# SimpleSubMenu #}
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="{{ topMenuItem.url }}" title="{{ topMenuItem.title }}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                    <a class="nav-link dropdown-toggle" href="#" id="{{ topMenuItem.title }}DropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {{ topMenuItem.title }}
                    </a>
                </li>
                
            {% elif topMenuItem.separator %}
                {# SeparatorMenuItem #}
                <li class="nav-item d-flex align-items-center px-2 text-muted">>{{ topMenuItem.separator }}</li>
                
            {% elif topMenuItem.label %}
                {# LabelMenuItem #}
                <li>{{ topMenuItem.label }}</li>
                
            {% else %}
                {# SimpleMenuItem #}
                <li class="nav-item">
                    <a class="nav-link" href="{{ topMenuItem.url }}" title="{{ topMenuItem.title }}">{{ topMenuItem.title }}</a>
                </li>
            {% endif %}
        {% endfor %}
    </ul>
</div>
