---
template: page-index
title: Hello, World!
headerImage: index-head.jpg
langs:
  en: index
slots:
  aside:
    - type: pageGallery
      template: aside-cards
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

Nazywam się Marcin Paździora i jestem programistą. PHP, JavaScript (ES6, nie niżej, na bogów Eternii!), TypeScript. Obecnie głównie TypeScript bo silne typowanie rządzi. Zajmuję się stroną backendową aplikacji internetowych, ale choćby na potrzeby tej strony musiałem przeprosić się z frontendem. Co absolutnie nie czyni mnie frątasiem, skądże! ;)

Ale kompetencjami zawodowymi chwalę się na [LinkedIn](https://www.linkedin.com/in/marcin-paździora-09a94625a). Oraz wystawiam parę repozytoriów na [GitHubie](https://github.com/forsetius). A także mam sporo fajnych artykułów tutaj:

<block id="competence"></block>
        
A tak prywatnie mówią na mnie Forseti i jestem nerdem. Gram w [gry fabularne](https://pl.wikipedia.org/wiki/Gra_fabularna), czytuję fantastykę, jeżdżę na konwenty. Trochę piszę scenariusze, które potem prowadzę (albo i nie), tworzę własną mechanikę i settingi, programuję narzędzia pod RPG-i. Mam też inne zainteresowania, patrz menu na górze.

<block id="interests"></block>
