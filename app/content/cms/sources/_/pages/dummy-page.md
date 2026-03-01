---
template: page-default
date: 2015-04-15
subcategoryName: Eclipse Phase
category: blog
langs:
  en: dummy-page
title: Title
subtitle: ?Subtitle
headerImage: index
#thumbnailImage: index-head
excerpt: ?Excerpt
lead: |
  lead
tags:
  - tag
slots:
  aside:
    - type: static
      content: |
        ## Linki
        - [Celestia Home](https://celestiaproject.space)
        - [Celestia Origins](https://vk.com/celestiaorigin)
    - type: pageGallery
      template: aside-cards
      sources:
        - category: eclipse-phase
          subcategory: more
      title: Chcesz wiedzieć więcej?
  bottom:
    - type: pageGallery
      sources:
      sortDir: desc
        - category: eclipse-phase
          subcategory: main
blocks:
  block:
    type: static
    content: |
      Content
  technobabbleGenerator:
    type: apiCall
    template: form-technobabble
    url: /api/1.0/startrek/technobabble?lang=pl
  celestiaPics:
    type: mediaGallery
    items:
      - src: celestia-55-Cancri-e-Janssen.jpg
        title: 55 Cnc e - Janssen, pierwsza planeta w układzie Kopernika
      - src: celestia-Io-Jowisz.jpg
        title: Io na tle Jowisza
      - src: celestia-Tytan.jpg
        title: Powierzchnia Tytana, księżyca Saturna
---
