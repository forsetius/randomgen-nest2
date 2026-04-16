---
name: package-docs
description: Use when README.md, CHANGELOG.md, docs/, or package example applications in this monorepo must be created, restructured, or synchronized with code changes, especially after API, integration, or behavior changes.
---

# Package Docs

Use this skill for documentation stored in:

- root `README.md`
- package `README.md`
- root or package `CHANGELOG.md`
- `docs/`
- documentation example applications

## Core rules

- Keep `README.md` concise. It must give a fast overview of the package, a short installation and usage guide, and links to deeper material. Do not turn `README.md` into a wall of text.
- Use `docs/` for detailed material.
- Whenever `docs/` contains useful files, link to them from the corresponding `README.md`.
- Every package must have at least one minimal example application that demonstrates practical usage.

## Required README shape

For package `README.md`, keep this order when the content exists:

1. Overview
2. How to install
3. How to integrate and use
4. Short, focused examples
5. API reference

If a section becomes long, move the detail into `docs/` and leave only a short summary plus links in `README.md`.

## Required docs/ structure

Start with a single file in `docs/` for each topic:

- `docs/ADR.md`
- `docs/API.md`
- `docs/Integration.md`
- `docs/Internal.md`
- `docs/Examples.md`

You must start with the single-file form. Only split a topic into a subdirectory when that single file would become too large or unreadable. When you split:

- keep the original top-level file as the table of contents for that topic
- use that top-level file to link to the files in the subdirectory
- add short descriptions of what each linked file contains

Examples:

- `docs/ADR.md` with links into `docs/adr/`
- `docs/API.md` with links into `docs/api-reference/`
- `docs/Examples.md` with links into `docs/examples/`

Do not create subdirectories eagerly. The top-level file remains mandatory after the split.

## Examples

- Keep example applications minimal but practical.
- Examples should show real wiring and usage, not only isolated type snippets.
- If an example includes TypeScript or Nest wiring, validate it with the narrowest relevant typecheck or package command.
- If an example would trigger real network behavior at bootstrap or runtime, call that out explicitly in the documentation or keep the example focused on configuration and wiring.

## Changelogs

- Use root `CHANGELOG.md` for repository-wide changes.
- Use package-local `CHANGELOG.md` for package changes when a changelog update is actually required.

## Validation

- If documentation contains changed code, treat it as code and validate it.
- If a shared package changed, update and validate directly affected package docs or examples when their usage changed.
- Prefer package-local validation before broader monorepo validation.
