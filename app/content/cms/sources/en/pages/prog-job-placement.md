---
template: page-default
title: Job placement
langs:
  pl: prog-posrednictwo-pracy
headerImage: mid-work-head.jpg
excerpt: An extensive system for advertising jobs and collecting applications
category: prog-experience
sort: 4
tags:
  - about-me
slots:
  aside:
    - type: static
      content: |
        ## Technologies
        - PHP 7.4 + Laravel
        - Node.js + TypeScript
        - Python
        - MySQL
---
In this project, I worked for a German client who had their own dedicated development team but needed support. As part of the team, we were developing a job placement system whose different parts collect candidate applications, distribute them across recruitment portals, match candidates with job offers and so on.

The client had a rich ecosystem of different services that I helped maintain and develop. Parts of it were written in PHP+Laravel, others in Node.js+TypeScript, there also happened to be one written in Python. Plus MySQL, ElasticSearch, nicely dockerised.

And yes, my job was to work with each of these technologies, often porting them to new versions or - as in the case of the Python service - iteratively porting them to other technologies. In general, the aim was to minimise the technology debt created during the organic growth of the platform. To this end, I also made CLI scripts to streamline development routines - both in Bash and in Node.js.

Another of my tasks was to implement content generators dedicated to individual recruitment portals. There were quite a few of them and more were added, for which strategies had to be developed. Finally, I created from scratch a new version of the service that creates feeds for recruitment portals. I wrote it in Node.js+TypeScript and it both sped up the content generation process and reduced resource consumption.
