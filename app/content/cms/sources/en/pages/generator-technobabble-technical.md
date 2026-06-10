---
template: page/default-sf
title: Technobabble generator
headerImage: startrek-engineers-head.jpg
langs:
  pl: generator-technobelkotu
excerpt: |-
  A Star Trek technobabble generator that randomly selects a phrase that could have come from the mouths of Scottie, O'Brien, or LaForge.
lead: |

  Okay, it's a fairly simple generator, especially in the English version. In Polish, it gets tricky as you have to reconcile all the genders, numbers and other things we, Poles love to toss at foreigners brave enough to use our language.
tags:
  - generator
  - startrek
  - sf

slots:
  asideRight:
    - type: static
      content: |
        ## API endpoints
        - [Polish](https://forseti.pl/api/1.0/startrek/technobabble?lang=pl)
        - [English](https://forseti.pl/api/1.0/startrek/technobabble?lang=en)

        ## Dictionaries
        - [Polish](https://github.com/forsetius/randomgen-nest2/blob/master/app/content/technobabble/startrek-pl.json)
        - [English](https://github.com/forsetius/randomgen-nest2/blob/master/app/content/technobabble/startrek-en.json)
---

## API access

If you need to integrate this generator into any of your tools, send an HTTP request:

```
GET https://forseti.pl/api/1.0/startrek/technobabble
```

Optionally, you can add two parameters to the query string:

- `lang` - language, allowed values: 'en' or 'pl'. Default: 'pl'
- `repeat` - how many phrases to randomly select. Allowed values: 1 to 20, default: 1

The response is plain text. If `repeat` > 1, then phrases are separated by a new line.

## Technicalities

I implemented this generator as a module of an application in Node.js+TypeScript, based on NestJS. Supports languages: Polish and English, with the possibility of adding more. Individual words (or in Polish - sets of grammatical forms of a given word) are read from JSON files.

If you would like to help me implement a new language or add some fancy vocabulary, please [contact me]{en/contact}.
