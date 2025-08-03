---
template: page-default
title: Generator technobełkotu
headerImage: startrek-engineers-head.png
langs:
  pl: 2022-01-03_generator-technobelkotu
category: blog
date: 2022-01-03
excerpt: |-
  A Star Trek technobabble generator that randomly selects a phrase that could have come from the mouths of Scottie, O'Brien, or LaForge.
lead: |
  Whether it's "The Original Series," "The Next Generation," or "Deep Space 9," when watching "Star Trek," we regularly see a red alert, emotions running high, a ship/station facing doom... and then suddenly the Chief Engineer lifts his gleaming eyes and finds a solution! "We just have to..."
tags:
  - generator
  - startrek
  - sf
slots:
  aside:
    - type: static
      content: |
        ## Sources
        - Code repository: [technobabble](https://github.com/forsetius/randomgen)
        - API endpoints: [Polish](https://forseti.pl/api/1.0/startrek/technobabble?lang=pl), [English](https://forseti.pl/api/1.0/startrek/technobabble?lang=en)
        - Source of phrases: [Polish](https://github.com/forsetius/randomgen/blob/dev/dict/technobabble-pl.json), [English](https://github.com/forsetius/randomgen/blob/dev/dict/technobabble-en.json)
        ## Terms of use
        The use is of course free, and I do not use any of your data.

        Only when integrating this generator into some application or tool of yours do I ask for attribution and reporting it to me (in order to stroke my ego and boost my motivation for further work)
  bottom:
    - type: apiCall
      template: form-technobabble
      url: /api/1.0/startrek/technobabble?lang=en
---
And here comes the **Technobabble Generator**. It creates a random, 5-word phrase that means nothing, but sounds very clever and technical. For example:

> ...reset the tetryon phase secondary coupler

Impressive, isn't it? All you have to do is snarl: "make it so!" and get to work.

Okay, it's a fairly simple generator, especially in the English version. In Polish, it gets tricky as you have to reconcile all the genders, numbers and other things we, Poles love to toss at foreigners brave enough to use our language.

## Use

So you're in the middle of a Star Trek Adventures RPG session and you want to shine as an engineer or other egghead? It's easy, click the button below:

## API access

If you need to integrate this generator into any of your tools, send an HTTP request to:

```
GET https://forseti.pl/api/1.0/startrek/technobabble
```

Optionally, you can add two parameters to the query string:
- `lang` - language, allowed values: 'en' or 'pl'. Default: 'pl'
- `repeat` - how many phrases to randomly select. Allowed values: 1 to 20, default: 1

The response is plain text. If `repeat` > 1, then phrases are separated by a new line.

## Technicalities
I implemented this generator as a module of an application in Node.js+TypeScript, based on NestJS. Supports languages: Polish and English, with the possibility of adding more. Individual words (or in Polish - sets of grammatical forms of a given word) are read from JSON files. If anyone would like to help me implement a new language or add some fancy vocabulary, please [contact me]{en/contact}.
