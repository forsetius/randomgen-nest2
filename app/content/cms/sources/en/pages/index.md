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
  generators:
    type: pageGallery
    title: Generators
    content: |
      These tools randomly generate content suitable for RPGs.
    sources:
      - items:
          - generator-technobabble
    columns: 2
lead: |
  **My name is Forseti and I don't like to describe myself.**
---

All right...

I'm called Forseti and I'm a nerd. I play role-playing games, read science fiction, go to conventions. I do a bit of scenario writing, which I then run (or not), I create my own mechanics and settings, I program tools for RPGs. I also have other interests, but I describe them on my [personal web page](https://forseti.pl/en).

<block id="generators"></block>
