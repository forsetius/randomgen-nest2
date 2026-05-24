---
template: page/index
title: Hello, World!
headerImage: index-head.jpg
langs:
  en: index
slots:
  aside:
    - type: pageGallery
      template: page-gallery/aside-cards
      title: Ostatnie wpisy
      sources:
        - category: blog
      count: 5
      sortDir: desc

blocks:
  competence:
    type: pageGallery
    count: 6
    columns: 2
    sources:
      - items:
          - prog-umiejetnosci
          - prog-doswiadczenia
          - randomgen
          - mod_cms
          - web-pane

  interests:
    type: pageGallery
    count: 4
    columns: 2
    sources:
      - items:
          - 2022-01-03_generator-technobelkotu
          - eclipse-phase
---

**Jestem Marcin i nie lubię się opisywać.**

No dobrze...

Mówią na mnie Forseti i jestem nerdem. Gram w gry fabularne, czytuję fantastykę, jeżdżę na konwenty. Trochę piszę scenariusze, które potem prowadzę (albo i nie), tworzę własną mechanikę i settingi, programuję narzędzia pod RPG-i. Mam też inne zainteresowania, patrz menu na górze.

<block id="interests"></block>
