---
template: page-index
title: Hello, Test!
langs:
  pl: index
headerImage: test.jpg
slots:
  aside:
    - type: pageGallery
      template: aside-cards
      title: Latest posts
      sources:
        - category: blog
      count: 2
      sortDir: desc
      
blocks:
  competence:
    type: pageGallery
    count: 6
    columns: 2
    sources:
      - items:
        - item-c
        - item-d

---
**This is a test page.**

<block id="competence"></block>

Privately, I'm called Forseti 
