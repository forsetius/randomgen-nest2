---
template: page/index
title: Hello, World!
headerImage: index-head.jpg
langs:
  en: index
slots:
  asideRight:
    - type: pageGallery
      template: page-gallery/aside-cards
      title: Ostatnie wpisy
      sources:
        - category: blog
      count: 3
      sortDir: desc

blocks:
  generators:
    type: pageGallery
    title: Generatory
    content: |
      Te narzędzia losowo generują rzeczy przydatne w grach fabularnych.
    sources:
      - tag: generator
    columns: 2

  ep:
    type: pageGallery
    title: Eclipse Phase
    content: Mnóstwo informacji o settingu Eclipse Phase.
    sources:
      - items:
          - ep-intro
          - ep-encyklopedia
          - ep-atlas
    columns: 2
---

**Jestem Forseti i nie lubię się opisywać.**

No dobrze...

Mówią na mnie Forseti i jestem nerdem. Gram w gry fabularne, czytuję fantastykę, jeżdżę na konwenty. Trochę piszę scenariusze, które potem prowadzę (albo i nie), tworzę własną mechanikę i settingi, programuję narzędzia pod RPG-i. Mam też inne zainteresowania, ale o tym piszę na mojej [stronie osobistej](https://forseti.pl).

W tym serwisie prezentuję treści, narzędzia i zasoby związane z grami fabularnymi.

<block id="generators"></block>

<block id="ep"></block>
