---
template: page-default
title: My skills
langs:
  pl: prog-umiejetnosci
excerpt: What I know, what I can
headerImage: mid-moje-umiejetnosci-head.jpg
tags:
  - about-me
lead: |
  I started programming... maybe in 1988. At first, it was on [Spectrum+](https://pl.wikipedia.org/wiki/ZX_Spectrum#ZX_Spectrum+_(1984)) and school's [Elwro 800 Junior](https://pl.wikipedia.org/wiki/Elwro_800_Junior), then I persuaded parents to buy me [Atari 65XE](https://pl.wikipedia.org/wiki/Rodzina_8-bitowych_Atari#Seria_XE). They didn't buy me a tape recorder, so that I wouldn't play games, but learn something useful with this computer. So I learned to program in Atari Basic.  
---
Fast forward, 9 employers and a couple of contractors later I am a backend web application developer. Until recently I worked mostly with PHP, mostly with Symfony, now I'm definitely more interested in Node.js written in TypeScript.

### Why Node? 
It's about life philosophy: I don't like wastefulness. In PHP, the lifecycle of an application is closely related to the lifecycle of a request - in short: a request comes into the server, the server passes it to the PHP module, a response is constructed via a router, controller, some services, etc., the controller responds.... and that's it, the whole elaborate object architecture goes into the bin. Sure, there are caches that speed up the process, but still - to me it's a waste. Meanwhile, in Node.js you make an application server that accepts requests, processes them and responds.... and then keeps working. Mainly with controllers and services prepared at the start of the application. And sure, it can also use caches too.

The second thing: asynchronicity. I was captivated by the fact that in JS, operations don't have to block each other, executing sequentially. Sure, there are PECL extensions _pthreads_ or _parallel_, there are queues etc. but these are extras, because the PHP language itself is synchronous. Instead, asynchronicity is native to JavaScript and can be applied to every tiniest operation that no one would want to implement asynchronously in PHP. In fact, in JS you have to enforce synchronicity :)

### Why TypeScript?
Because strong typing. _(in words: full-stop) _

All variables have a strictly defined type, and operations between different types are controlled or not allowed without explicit conversion. That is, there is no arbitrariness in passing arguments to functions, no strange implicit conversions, no guessing what goes in and what comes out of a given piece of code either. Typing errors are caught early at the compilation stage, before the code is run. Typical problems such as incorrect parameter passing or incompatible data structures are more easily avoided. Code readability is improved and code maintenance is easier. Development tools work more efficiently, resulting in higher productivity. As a result, TypeScript reduces the risk of application errors and promotes more predictable software development.

## Additional skills
Of course, PHP, Symfony, Node, TypeScript, Nest.js are not everything. As developers, we don't work in silos and some experience in related fields is a must - if only to know what the frontend or devops guys are talking about and, more often than not, to be able to solve some problems ourselves without waiting for other team members to help. Knowing how to use Docker itself is essential these days, but I can also dockerise an application. MySQL, PostgreSQL (also with PostGIS) - no problem, I also had experience with MSSQL. With writing SQL queries too, of course, also using an object-oriented way - in Doctrine or TypeORM.

I also used PHP or Node.js ‘atypically’ - for example in CLI applications. Usually these were small things, scripts used when ordinary shell scripts were becoming overly complex and simply difficult to maintain. I also wrote a bot for Discord in Node.js.
