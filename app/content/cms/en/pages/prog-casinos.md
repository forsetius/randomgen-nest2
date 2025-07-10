---
template: page-default
title: Backoffice for casinos
langs:
  pl: prog-kasyna
headerImage: mid-casino-head.jpg
excerpt: A platform that manages casinos, gaming, payments and all player-related activities
lead: |
  Comprehensive backoffice platform for managing online casinos. The system manages multiple casinos, each of which can offer different games from different suppliers. Features include: player support, performing various legally required checks (PEP, player documents, anti-money laundering), transaction analysis (including deposits, withdrawals, potential fraud), etc.
category: prog-experience
sort: 3
tags:
  - about-me
slots:
  aside:
    - type: static
      content: |
        ## Technologies
        - PHP 8 + Symfony 6
        - Node.js + TypeScript
        - Serverless
---
It was the largest project I worked on. In total, more than a dozen developers, devops and testers worked on it. It was divided into several independent services, of which I worked on the backoffice backend, the security module and the reports module.

We had the opportunity to start from scratch, so we prepared a comprehensive architecture using, among other things, CQRS with event sourcing and full test coverage. We worked in the latest (at the time) version of PHP and Symfony, in a dockerised environment.

I worked on the project from the beginning, implementing both basic functionality (list and filter system, permissions system) and more complex business logic, e.g. related to player verifications, responsible gaming systems, strategies for handling payment providers and game suppliers, etc.

When the workload eased I moved on to other projects, but returned when there was a need to implement a reporting module. This time we did it in Node.js in TypeScript, on AWS Lambda. These were operations on large datasets, so the idea was that the service receives a request to generate a report, acknowledges that request, then processes it in the background, and saves the results in CSV and XLS files. The reports themselves were quite diverse, but I still managed to set up the right abstractions for the various processing phases and everything worked in a clear, easy-to-understand way.

This time we did not use Nest.js but pure Node with TypeORM. I also prepared comprehensive tests and documentation for this module.