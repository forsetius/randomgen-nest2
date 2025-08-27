---
template: page-default
title: mod_cms
headerImage: mid-cms-module.jpg
langs:
  pl: mod_cms
excerpt: CMS module that generates the static HTML pages
tags:
  - projects
slots:
  aside:
    - type: static
      content: |
        ## Linki
        - [Project repository](https://github.com/forsetius/randomgen-nest2)
        - [Less technical description]{en/2025-08-06_cms-module}

lead: |
  **Mod\_CMS** is a CMS (content management system) implemented in Node.js and TypeScript as a module within a NestJS application.
---
Its operation combines content stored in Markdown files (with YAML front matter) with Nunjucks templates and publishes the result as ready-to-serve static HTML pages. As a result, the serving layer can remain very lightweight - files are exposed directly by Express (under NestJS), and where justified, targeted interactivity can be added with HTMX. The principle is straightforward: content and metadata are the source of truth, layout and filters handle presentation, and building happens before serving.

A key benefit of this approach is predictability. Each page is a deterministic outcome: Markdown => HTML (with extensions) => a Nunjucks layout => the final file. Metadata validation via Zod halts publication if required fields are missing, while parser extensions ensure output quality by generating stable heading identifiers and rewriting internal links to consistent URLs. Internationalization is supported through parallel language trees, and assets such as images and scripts are served statically.

## Features

* Front matter metadata with validation: title, description, category, tags, date, OG images, and indexing flags.
* Extended Markdown: stable, per-page-unique heading IDs, custom internal-link notation, and control over external link attributes.
* Nunjucks: a base layout, partials (head, header, footer, breadcrumb), and filters (e.g., date formatting via Luxon).
* i18n: parallel trees under `/pages/pl/…` and `/pages/en/…`.
* SEO/social: meta/OG/Twitter fields populated from front matter.
* Static serving: fast delivery without involving controllers for finalized pages.

## Architectural Decisions

The project follows a “build-time first” principle. Pages are compiled to files first and only then served, shifting compute costs from request time to publication time and simplifying system behavior under load.

Content and metadata remain separate from presentation: Markdown carries information and metadata, while Nunjucks governs layout and view composition. This separation makes it easy to swap themes, reorganize sections, or change templates without touching source materials.

Metadata validation is configured in a fail-fast mode to immediately stop the pipeline when fields are missing or inconsistent. Errors are caught early, when they are cheapest to fix. Builds are deterministic: identical inputs produce identical outputs, including stable heading IDs and consistent internal URLs. This predictability enables snapshot testing and repeatable releases.

Static serving is the default mode, exposing `/pages`, `/media`, and `/ui` (scripts and CSS) without engaging NestJS controllers. The result is simplicity, lower overhead, and a clear caching model. Extensions—whether custom Markdown rules or Nunjucks filters—are organized into small, easily testable modules, which limits blast radius and eases maintenance. The i18n layer is based on parallel language trees (`/pl` and `/en`), allowing different metadata and structure without language leakage.

Dynamism is kept in check: HTMX is treated as an additive layer on top of a static base. The performance profile therefore resembles an “almost static” site, with the option to add interactivity where it yields tangible benefits.

## High-Level Implementation

The system consists of several cooperating layers. Markdown processing handles rendering and extensions (heading identifiers, internal-link rewriting). The Nunjucks renderer applies the layout, partials, and filters. A generator ties these steps into a cohesive publication pipeline and writes the resulting HTML to a static structure. Separately, Express mounts static directories, allowing the server to act like a classic file host while keeping NestJS application logic free from serving finalized pages. Where provisioned in the layouts, HTMX slots are available to enrich content with lightweight fragments.

## Control Flow

1. Read the `.md` file and split front matter from content.
2. Validate metadata with Zod.
3. Render Markdown → HTML with extensions (e.g., unique heading IDs, internal links).
4. Compose the HTML with the Nunjucks layout and partials.
5. Write the final page into the static tree (`/content/static/pages/<lang>/…`).
6. Serve statically via Express (NestJS).

## HTMX-Driven Dynamics

HTMX is a precisely applied enhancement rather than the foundation of the interface. Layouts define locations where `hx-*` attributes (e.g., `hx-get`, `hx-boost`, `hx-target`, `hx-swap`) can be enabled and fed by lightweight endpoints returning ready-made HTML fragments. Most pages therefore remain fully static, and only sections that genuinely benefit from live data fetch dynamically.

Clear boundaries of responsibility are maintained. The base HTML document is complete and useful on its own; HTMX-injected fragments merely augment it—for example with related-content lists, small widgets, or comments. This promotes idempotency and predictability: HTML-serving endpoints are narrow in scope, aligned with layout conventions, and easy to snapshot-test. Consistent use of `hx-target` and `hx-swap` ensures stable selectors and unambiguous injection points, avoiding cross-cutting DOM rewrites. In line with minimalism, additional state layers are not introduced where `hx-boost` and simple `hx-get` suffice.

## Summary

The **Mod_CMS** module combines the pragmatism of a static-site generator with the flexibility of HTMX fragments. Content and metadata are compiled into predictable HTML served like ordinary files, while interactivity is added selectively where it improves the experience without inflating complexity. This setup supports fast load times, stable builds, and transparent maintenance, while leaving room to evolve layout, structure, and publication automation.

## Future Development

At present, the CMS module does not require a database, and user authentication is not included (there is no need). These capabilities are planned for the future, for example to support newsletters or notifications.
