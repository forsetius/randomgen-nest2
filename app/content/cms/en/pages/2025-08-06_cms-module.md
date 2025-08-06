---
title: CMS module
langs:
  pl: 2025-08-06_modul-cms
excerpt: Work on CMS module of RandomGena is finished!
headerImage: mid-cms-module.jpg
category: blog
date: 2025-08-06
tags:
  - randomgen
slots:
  aside:
    - type: static
      content: |
        ## Links
        - [more technical description]{en/randomgen}
        - [Project repository](https://github.com/forsetius/randomgen-nest2)
lead: |
  Hooray! The first version of the CMS module is complete!

  So, what’s the CMS module, you ask? Well, it’s the part of the RandomGen application that’s letting you read this page right now :)
---
**RandomGen** is an application that provides generators for all sorts of tabletop RPG-related goodies. At the moment, one generator is live, and another is undergoing internal testing. To use them, you send a request to a specific endpoint - making them easily usable in third-party applications. But let’s be honest: for regular users, clicking a button on a website is way more convenient (and desirable). Not everyone’s a nerd, unfortunately ;)

So, I needed something to serve these pages. Not just these, actually - I figured it would be nice to also include my personal site, a gallery of my precious creations, and maybe even an encyclopedia of [Eclipse Phase RPG]{en/eclipse-phase} lore.
At the same time, it makes sense to isolate this content management logic into a standalone module that could be reused in other projects - without the generators or my personal eccentricities. That’s why I wrapped the CMS functionality into its own self-contained module with clearly defined dependencies, ready to be plugged into future applications when needed.

## How it works
The CMS module takes page definitions written in Markdown and turns them into static HTML pages. Well… mostly static—we’ll get to that in a second.

Anyway, at its current stage, the CMS doesn’t need a database. After a short startup (just a few seconds for ~300 pages), it can quickly serve pre-rendered pages to users. It follows the “write once, read many” model: expensive operations (like page generation) are done once, and then the server just reuses the output efficiently.

But not everything can be handled statically. Articles, documentation, blog posts - sure. But things like user login, contact forms, generator pages, or fancy galleries? Not so much.

That’s where HTMX comes in. I’ve added it to the static HTML so the pages can interact with the server: fetching data, submitting forms, or dynamically updating sections of the page. These interactions can be anything - from fetching generator results, to pulling weather forecasts from a remote API, to sending emails.

## Features
Okay, cool story—but what can this thing actually do? Well, it comes with:

- Multilingual support
- All standard Markdown formatting, including GFM (GitHub Flavored Markdown)
- Simplified internal linking
- Hierarchical categories – categories can be nested, and each level can be displayed separately
- Tagging support – tags aren’t hierarchical, but a page can have as many as needed
- Embedding images, videos, and media galleries in a lightbox viewer
- Embedding galleries of pages – filtered by category, subcategory, tags, or manually defined lists. These can be displayed as plain links or illustrated cards with captions
- Dynamic search – quick and full-text options, even within galleries

As I mentioned, this CMS module is the very thing powering the page you're reading right now. To see more of what it can do, feel free to explore the rest of the site!

