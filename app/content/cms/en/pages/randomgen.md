---
template: page-full-width
title: randomgen
langs:
  pl: randomgen
excerpt: A Nest.js framework used for RPG generators and more
blocks:
  generators:
    type: pageGallery
    sources:
      - tag: generator
lead: |
  RandomGen is a collection of generators for role-playing games.
  All generators are implemented as modules within a single Node.js application built with the Nest.js framework and written in TypeScript. They are available in two modes: via the subpages listed below or through dedicated API endpoints.

  <block id="generators" />
---
## Core Modules
Generators are, of course, just one part of the system. In addition to them, RandomGen also includes several base modules:
- `config` - loads environment variables, validates them, and ensures the configuration is complete. It also allows defining registry-like configuration entries, mapping environment variables to them, and providing safe, typed access.
- `parser` - provides services for parsing Markdown and reading/parsing files. The Markdown parser includes modifications and enhancements for use in the CMS module, such as internal linking, markup of page segments or link types.
- `security` - handles request throttling to mitigate flooding with requests, filters out spam, and configures CORS and CSP policies.
- `templating` - enables rendering of content by populating templates with data. Currently used by the CMS module and `mail` service, with planned future use for sending SMS messages, or push notifications.
- `mail` - as the name suggests, handles email delivery. The messages to be mailed and constructed with help of the `templating` service.

## CMS Module
The final base module is the CMS, which warrants special attention due to its complexity.

This module processes pages defined in Markdown (along with their components such as menus or various content blocks) and renders them into static HTML files using templates and the `templating` module. These files are not entirely static, as they include HTMX elements that enable issuing  HTTP requests. As a result, such pages support email submission, form handling, live search, galleries that fetch pre-rendered content, and more.

At application startup, several sets of pages and HTML fragments are generated and served statically. This follows a "write once, read many" principle, enabling very fast responses. Only the homepages is served through the application’s main endpoint; all other pages are static HTML+HTMX files.

Additional features of the CMS module include:
- rendering pages using various template types,
- defining menus via JSON or YAML files,
- embedding content blocks flexibly within page content: static content, media and media galleries, subpage galleries, data fetched from internal endpoints or external APIs. These blocks can also be assigned to predefined page regions,
- categorizing pages for easier creation of subpage galleries. Categories are hierarchical—pages can belong to a category that is itself nested within a higher-level category,
- content tagging,
- search across title, excerpt, categories, and tags,
- simplified internal linking between pages,
- a built-in lightbox for viewing media and galleries,
- RSS feeds providing updates for pages in the "blog" category,
- support for many languages

## Future Development
In the next development phase, additional modules will be introduced, including `db` (for database support) and `user` (handling registration, login, etc.). Other modules - such as `redis`, `sms`, or `push` - will be added as needed.

Currently, the CMS module does not require a database or user authentication, as these features are not yet necessary. However, both are planned for future implementation, particularly to support features such as newsletters or notifications.

Naturally, new generators will also be added. One in development is a planetary system generator, to be followed by generators for faction relationships in a city (supporting fantasy, modern fantasy, and sci-fi settings), and scenario generators for the [Eclipse Phase]{pl/eclipse-phase} RPG.
