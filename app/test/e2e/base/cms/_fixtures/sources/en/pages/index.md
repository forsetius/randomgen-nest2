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
        - prog-skills
        - prog-experience
        - randomgen
        - mod_cms
        - web-pane

---
**This is a test page.**

<block id="competence"></block>

Privately, I'm called Forseti and I'm a nerd. I play [role-playing games](https://en.wikipedia.org/wiki/Role-playing_game), read science fiction, go to conventions. I do a bit of scenario writing, which I then run (or not), I create my own mechanics and settings, I program tools for RPGs. I also have other interests, see menu at the top.