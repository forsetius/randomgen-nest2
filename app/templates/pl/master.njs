<!DOCTYPE html>
<html lang="{{ meta.lang }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href='https://fonts.googleapis.com/css?family=Fira+Sans+Condensed&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Unica+One&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Fira+Sans&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <script src="https://use.fontawesome.com/c6547e41bf.js"></script>  
        {% block meta %}{% endblock %}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous">

        <link id="theme" rel="stylesheet" type="text/css" href="css/styles.css" title="theme" />
        {% block style %}{% endblock %}
        <link rel="icon" type="image/x-icon" href="img/favicon.png" />
    </head>
<body class="{% block bodyClass %}default-page{% endblock %}">
    <header>
        <nav id="topbar-nav" class="navbar navbar-expand-lg navbar-dark bg-custom-dark ">
            <a class="navbar-brand" href="/">{{ brand.name }}</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <menu id="topbar" />
        </nav>
        {% block header %} {% include "./header.njs" %} {% endblock %}
    </header>

    <main>
        {% block article %} {% endblock %}
        {% block aside %} {% endblock %}
    </main>

    <footer>
        <menu id="footer" />
    </footer>

        <!-- compiled and minified JavaScript -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq" crossorigin="anonymous"></script>
        {% block javascripts %}{% endblock %}
    </body>
</html>