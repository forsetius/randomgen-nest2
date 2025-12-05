---
template: page-default
title: 1&#8209;na&#8209;1 conversations
langs:
  pl: prog-1on1
excerpt: A tool for HR departament to convey 1-on-1 talks
headerImage: mid-hr-1on1-head.jpg
category: prog-experience
sort: 2
tags:
  - about-me
slots:
  aside:
    - type: static
      content: |
        ## Technologies
        - ADFS + Auth0 (authentication)
        - Node.js + Express.js + Sequelize
        - PostgreSQL
---
This tool addressed the need to improve both the process and the results of HR processes in a large financial sector corporation. It is a tool for HR departments to plan, conduct and monitor the effects of 1&#8209;na&#8209;1 interviews, such as annual appraisals.

Our team of a handful of people consisted of, among others, a Dane, a Romanian, a Lithuanian and us, Poles. Of course, we all spoke English very well, so we got along without a problem. Overall, I have good memories of this collaboration and especially of a week of coding together at the client's premises.

As for the project itself, unfortunately it wasn't done from scratch - we were given legacy code with no documentation and no tests to wade through. In places it was so convoluted we'd rather write it from scratch. We leveraged that and added all the necessary features on top of the inherited framework. Among the notable ones were:

- authentication integrated into the corporation's Active Directory, using Auth0
- users and their teams were mapped to the application as part of the daily (actually nightly) synchronisation.
- integrations with Stripe, Sendgrid, Slack, Google Calendar
- CRUD endpoints for the management of meetings, their templates and agenda, objectives and tasks for employees and feedback
