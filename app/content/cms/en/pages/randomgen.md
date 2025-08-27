---
template: page-default
title: randomgen
headerImage: mid-randomgen.jpg
langs:
  pl: randomgen
excerpt: A Nest.js framework used for RPG generators and more
tags:
  - projects
slots:
  aside:
    - type: static
      content: |
        ## Links
        - [Project repository](https://github.com/forsetius/randomgen-nest2)
blocks:
  generators:
    type: pageGallery
    sources:
      - tag: generator
lead: |
  **RandomGen** is a collection of generators for role-playing games.
  All generators are implemented as modules within a single Node.js application built with the Nest.js framework and written in TypeScript. They are available in two modes: via the subpages listed below or through dedicated API endpoints.

  <block id="generators" />
---
## Core Modules
Generators are, of course, just one part of the system. In addition to them, RandomGen also includes several base modules:
- `config` - loads environment variables, validates them, and ensures the configuration is complete. It also allows defining registry-like configuration entries, mapping environment variables to them, and providing safe, typed access.
- `mail` - as the name suggests, handles email delivery. The messages to be mailed and constructed with help of the `templating` service.
- `parser` - provides services for parsing Markdown and reading/parsing files. The Markdown parser includes modifications and enhancements for use in the CMS module, such as internal linking, markup of page segments or link types.
- `security` - handles request throttling to mitigate flooding with requests, filters out spam, and configures CORS and CSP policies.
- `templating` - enables rendering of content by populating templates with data. Currently used by the CMS module and `mail` service, with planned future use for sending SMS messages, or push notifications.
- `cms` - implements rendering of content stored in Markdown files into statically served HTML files, with optional HTMX enhancements. Owing to its greater complexity, it is covered in [a dedicated article]{en/mod_cms}

## Future Development
In the next development phase, additional modules will be introduced, including `db` (for database support) and `user` (handling registration, login, etc.). Other modules - such as `redis`, `sms`, or `push` - will be added as needed.

Currently, the CMS module does not require a database or user authentication, as these features are not yet necessary. However, both are planned for future implementation, particularly to support features such as newsletters or notifications.

Naturally, new generators will also be added. One in development is a planetary system generator, to be followed by generators for faction relationships in a city (supporting fantasy, modern fantasy, and sci-fi settings), and scenario generators for the [Eclipse Phase]{pl/eclipse-phase} RPG.
