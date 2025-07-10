---
template: page-default
title: The Faker affair
headerImage: mid-afera-fakera-head.jpg
langs:
  pl: 2022-01-11_afera-wokol-fakera
category: blog
date: 2022-01-11
excerpt: Sabotage in NPM packages `colors` and `faker`
lead: |-
  There was a programmer. He coded open source packages for Node.js and shared them with the community through regular channels (GitHub, NPM). In his private life, he had a love affair with conspiracy theories, a fire in his own apartment, and an investigation into terrorism, but he did his job. And now he suddenly turned red and started sabotaging his – and unfortunately not only his – projects.
tags:
  - open-source
slots:
  aside:
    - type: static
      content: |
        ## Sources
        - Technical description of the problem with `colors`: 
            [Dev corrupts NPM libs 'colors’ and 'faker’ breaking thousands of apps](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/)
            - Report of a fire at Marak's house: 
            [Neighbor on Queens man with bomb-making equipment:…](https://abc7ny.com/suspicious-package-queens-astoria-fire/6425363/)
        - Projekt `colors` status: 
            [(Semi-Official) Status Update](https://github.com/Marak/colors.js/issues/317)
        - Project `faker` status:
            [I heard something happened. What's the TLDR?](https://fakerjs.dev/about/announcements/2022-01-14.html#i-heard-something-happened-what-s-the-tldr)

---
## Dependency Ecosystem
The ecosystem of applications written in Node.js assumes the use of ready-made building blocks offering some partial functionality when writing them instead of writing them by the programmer himself. For example, a programmer in his application does not have to rewrite functions supporting coloring or creating fictitious data for testing, because he only declares the use of appropriate packages that have been made available for free to the community. Cool and logical, right?

Let's assume that we are writing a blog application. It starts a server that accepts requests from users, does something important with them and responds to the user. It does various things, but this is the main functionality that we focus on. In addition to the main functionality, there are also small side details: you have to write tests to check whether the code works, and some tools for cyclical cleaning work would be useful, for example summarizing blog activity for a given day and sending it by email.

So we need a tool for testing and a tool for launching scripts from the command line (CLI). Ok, so we download the appropriate packages from the NPM service. We conclude that for testing we need a tool that will randomly select the name and surname of the user for testing – ok, another package from NPM. The packages we download are built in a similar way – they also have their dependencies. For example, a package for CLI support may have built-in text coloring, which it prints to the console. So it has a dependency on the coloring package. Well, whatever, let's take one more pack, right?

So we declare our dependencies, run the `npm install` command and voila! it installs. Great, although in the end it turns out that we declared a dozen or so dependencies, but these dependencies had dependencies that had their own dependencies… and `npm` announces that it has installed several hundred packages, of which a hundred or so are looking for funding.

## Marak Squires

One of these programmers looking for support is Marak Squires, who is the author of the `faker` and `colors` packages. Well, actually he was, because GitHub suspended his account and cut him off from all projects, and NPM doesn't want him anymore either.

Marak began to demand payment for using his code rather than asking. He had a bone to pick with corporations that take it for free, the programmer gets nothing from it, and these giants make a fortune. He declared that if they wanted to use his work, they should pay him 6 figures, etc. There are various rumors in the community as to why he suddenly started caring so much about money - from that he fell into the trap of gambling to that his house burned down and he is in real need. Well, Marak's house actually burned down at the end of 2020, and Marak ended up in the hospital. However, it turned out that the chemicals used to produce explosives he was working with caught fire. There was an [investigation](https://abc7ny.com/suspicious-package-queens-astoria-fire/6425363/) — I don't know if and how it ended.

Now Marak got pissed off and started sabotaging his projects: he cleaned up the `faker` repository and did something worse with `colors` — he introduced an infinite loop. So basically he sabotaged his project. What did that lead to? Let's get back to our blog app. In good faith, we update our dependency packages from time to time - because bug fixes, patches, new features are released - and suddenly our application stops working. What, how, I didn't do anything! Besides, it usually works, it only breaks down when it has to use those unfortunate colors - which is not immediately obvious. But then something like this is displayed:
<block id="article-img1" type="media" template="lightbox-image" src="colors-sabotage.png" title="Sabotage of `colors` package" />

Well, corporations have implemented strict dependency update policies, so this won't affect them - but small and medium players, and especially newbies, will get hit. `colors` is a fairly popular package, so the alarm probably went off in several to several dozen thousand projects.

## Open Source Financing
And this is not just a sensational news item. Finally, the question remains: how to finance open source software, which is largely created thanks to the work of enthusiasts and is made available for free. And above all, the code is public, so if someone doesn't like the license, they can take the code and release it as their own. And then, third world programmer, take it and prove to the first world giant that they have infringed on your intellectual property.

In my opinion, the guy did something wrong and there's probably something wrong with his head. But the fact is that the Open Source world has a problem with financing. I came across this when I was making an application in Nest.js – a very popular Polish framework that uses the TypeORM package to handle the database. The author of Nest managed to do well in business and, in addition to accepting donations, organizes training courses, etc. However, the author of TypeORM had to suspend the development of his package for over half a year at one point to earn a living in another way. And his product is top in its niche - only invisible, because it is a dependency.
