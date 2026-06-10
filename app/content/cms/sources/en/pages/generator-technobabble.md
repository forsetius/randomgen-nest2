---
template: page/default-sf
title: Technobabble generator
langs:
  pl: generator-technobelkotu
headerImage: startrek-engineers-head.jpg
excerpt: |-
  A Star Trek technobabble generator that randomly selects a phrase that could have come from the mouths of Scottie, O'Brien, or LaForge.
lead: |
  Whether it's "The Original Series," "The Next Generation," or "Deep Space 9," when watching "Star Trek," we regularly see a red alert, emotions running high, a ship/station facing doom... and then suddenly the Chief Engineer lifts his gleaming eyes and finds a solution! "We just have to..."
tags:
  - generator
  - startrek
  - sf

blocks:
  technobabbleGenerator:
    type: apiCall
    template: block/form-technobabble
    url: /api/1.0/startrek/technobabble?lang=en

slots:
  asideRight:
    - type: static
      content: |
        ## Terms of use
        The use is of course free, and I do not use any of your data.

        Only when integrating this generator into some application or tool of yours do I ask for attribution and reporting it to me (in order to stroke my ego and boost my motivation for further work)
    - type: static
      content: |
        ## Technicalities
        The generator exposes API too. You can read about it and about some implementation details on the [Technicalities]{en/generator-technobabble-technical} page.
---

And here comes the **Technobabble Generator**. It creates a random, 5-word phrase that means nothing, but sounds very clever and technical. For example:

> ...reset the tetryon phase secondary coupler

Impressive, isn't it? All you have to do is snarl: _"make it so!"_ and get to work.

## Use

So you're in the middle of a Star Trek Adventures RPG session and you want to shine as an engineer or other egghead? It's easy, click the button below:
<block id="technobabbleGenerator" />
