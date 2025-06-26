<meta property="og:title" content="{{ title }}" />
<meta property="og:type" content="{{ 'article' if category == 'blog' else 'website'  }}" />
<meta property="og:image" content="{{ appOrigin }}/media/{{ thumbnailImage }}" />
<meta property="og:url" content="{{ appOrigin }}/pages/{{ lang }}/{{ filename }}" />
<meta property="og:site_name" content="{{ brand.name }}" />
{% if dateTime %}
  <meta property="article:published_time" content="{{ dateTime|formatDate(lang, "yyyy-MM-dd'T'HH:mm:ssZZ") }}" />
{% endif %}
{% if category %}
  <meta property="article:section" content="{{ category }}" />
{% endif %}
{% for tag in tags %}
  <meta property="article:tag" content="{{ tag }}" />
{% endfor %}