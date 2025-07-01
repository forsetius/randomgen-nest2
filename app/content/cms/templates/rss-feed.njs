<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>{{ metadata.brand.name }}</title>
    <link>{{ metadata.appOrigin }}</link>
    <description>{{ translations.lastPosts }}</description>
    <language>{{ lang }}</language>
    {% for page in pages %}
      <item>
        <title>{{ page.title }}</title>
        <link>{{ metadata.appOrigin }}/pages/{{ lang }}/{{ page.filename }}</link>
        <description>
          <![CDATA[
          <img src="{{ metadata.appOrigin }}/media/{{ page.thumbnailImage }}" />
          <p>{{ page.excerpt }}</p>
          ]]>
        </description>
        <pubDate>{{ page.dateTime|formatDate }}</pubDate>
      </item>
    {% endfor %}
  </channel>
</rss>