---
template: page-index
title: Hello, World!
langs:
  pl: index
headerImage: index-head.jpg
slots:
  aside:
    - type: pageGallery
      template: aside-cards
      title: Latest posts
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
        - prog-skills
        - prog-experience
        - randomgen
        - mod_cms
        - web-pane
        
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

My name is Marcin Paździora and I am a programmer. PHP, JavaScript (ES6, not below, by the gods of Eternia!), TypeScript. Currently mainly TypeScript because strong typing rules. I do the backend side of web applications, but if only for this site, I had to dabble with the frontend. 

But I boast about my professional competence on [LinkedIn](https://www.linkedin.com/in/marcin-paździora-09a94625a). And I put up some repositories on [GitHub](https://github.com/forsetius). And I have some flashy pages on it here:

<block id="competence"></block>

Privately, I'm called Forseti and I'm a nerd. I play [role-playing games](https://en.wikipedia.org/wiki/Role-playing_game), read science fiction, go to conventions. I do a bit of scenario writing, which I then run (or not), I create my own mechanics and settings, I program tools for RPGs. I also have other interests, see menu at the top.

<block id="interests"></block>