---
template: page/index
title: Hello, World!
langs:
  pl: index
headerImage: index-head.jpg
slots:
  asideRight:
    - type: pageGallery
      template: page-gallery/aside-cards
      title: Latest posts
      sources:
        - category: blog
      count: 3
      sortDir: desc

blocks:
  interests:
    type: pageGallery
    count: 4
    columns: 2
    sources:
      - items:
          - 2022-01-03_technobabble-generator
          - eclipse-phase
---

**My name is Marcin and I don't like to describe myself.**

All right...

I'm called Forseti and I'm a nerd. I play [role-playing games](https://en.wikipedia.org/wiki/Role-playing_game), read science fiction, go to conventions. I do a bit of scenario writing, which I then run (or not), I create my own mechanics and settings, I program tools for RPGs. I also have other interests, see menu at the top.

<block id="interests"></block>
