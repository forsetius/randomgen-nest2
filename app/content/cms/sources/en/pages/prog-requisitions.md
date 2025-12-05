---
template: page-default
title: Tool requisitions
langs: 
  pl: prog-requisitions
excerpt: Mobile application allowing employees to request the purchase of tools
headerImage: mid-requisition-head.jpg
category: prog-experience
sort: 5
tags:
  - about-me
slots:
  aside:
    - type: static
      content: |
        ## Technologies
        - Node.js + TypeScript
        - Nest.js
        - MySQL
---

Let's assume that we are a manager in a construction company and we have blue-collar workers reporting back to us who work at scattered construction sites. One of the problems we may face is the uncontrolled purchase of tools by employees. For example, a team leaving the headquarters will forget a set of spanners or their drill bits will break on site. In such a situation, the foreman drives to the nearest shop and buys another one. Sometimes this is justified, and sometimes it just generates unnecessary costs.

The application whose backend I am implementing solves this problem by allowing an employee to place a goods requisition in the application and get (or not) the supervisor's approval for the purchase. Having obtained approval, he or she has a certain amount of time to fulfil the order.

Although it was a fairly simple application overall, it had two more complex elements: the onboarding of the company, which required integration with the Norwegian enterprise registry, and the implementation of requisition entity state changes, realised using the State template. On top of this, I implemented the sending of emails, SMS and PUSH notifications.

The entire application was implemented in Nest.js using TypeScript. This was another implementation using this duo and, as a result, a Nest app “template” could be extracted from the final work. This way, I made what could be the core of a new application with modules for ApiDoc, configuration, database connection, templates, notification sending and so on. All developed in the Nest.js paradigm, tested in production, documented.
