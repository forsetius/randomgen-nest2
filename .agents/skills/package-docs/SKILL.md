---
name: package-docs
description: Use when README.md, app/README.md, docs/, or documentation snippets in this repository must be created, restructured, or synchronized with code changes, especially after configuration, integration, or behavior changes.
---

# Repository Docs

Use this skill for documentation stored in:

- root `README.md`
- `app/README.md`
- `docs/`
- documentation snippets embedded in repository files
- optional `CHANGELOG.md` files when the repository decides to use them

## Core rules

- Keep `README.md` and `app/README.md` concise. They must give a fast overview, short setup or usage guidance, and links to deeper material. Do not turn them into walls of text.
- Use `docs/` for detailed material.
- Whenever `docs/` contains useful files, link to them from the corresponding `README.md`.
- This repository does not require separate minimal example applications. Prefer focused snippets, request or response examples, configuration fragments, or links to real app modules.
- If you touch `app/README.md`, replace irrelevant Nest starter boilerplate instead of preserving it.

## Required README shape

For root `README.md` and `app/README.md`, keep this order when the content exists:

1. Overview
2. How to run or integrate
3. Configuration or environment
4. Short, focused examples
5. Links to deeper docs

If a section becomes long, move the detail into `docs/` and leave only a short summary plus links in `README.md`.

## Required docs/ structure

Start with a single file in `docs/` for each topic:

- `docs/ADR.md`
- `docs/API.md`
- `docs/Integration.md`
- `docs/Architecture.md`
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

- Keep examples minimal but practical.
- Prefer examples that show real Nest wiring, configuration shapes, template usage, or HTTP behavior instead of isolated type trivia.
- If an example is meant to compile or run, validate it with the narrowest relevant command.
- If an example would trigger real network behavior at bootstrap or runtime, call that out explicitly or keep it focused on configuration and wiring.

## Changelogs

- Do not add or update changelogs unless the task or repository policy explicitly requires it.

## Validation

- If documentation contains changed code, treat it as code and validate it.
- If app configuration, integration flow, or HTTP contracts changed, update directly affected docs or snippets when asked.
- Prefer app-local validation before broader repository validation.
