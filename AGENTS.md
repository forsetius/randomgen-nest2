# AGENTS.md

## Repository scope

- This repository hosts one Nest.js application in `app/`.
- The application is a staging ground for a website and a backend API of random generators.
- The ongoing refactor replaces legacy modules from `app/src/base/*` with `@forsetius/glitnir-*` packages.
- The Glitnir monorepo lives in `../glitnir` and is the source of shared package conventions.
- Preserve current behavior while moving code to external Glitnir packages. Do not add unrelated features during that refactor.
- Preserve runtime assumptions, `tsconfig`, lint rules, app tooling, and established module boundaries unless the task explicitly requires changing them.
- Prefer the smallest safe change. Propose local cleanup only when it materially improves the touched area.

## Workflow routing

- Use `.agents/skills/package-docs` for root `README.md`, `app/README.md`, `docs/`, and documentation snippets.
- Use `.agents/skills/jsdoc-docs` for JSDoc work.
- Use `.agents/skills/pr-check` when told that I am going to open a PR or want a pre-PR audit.

## Documentation policy

- Update documentation only when asked to.
- When asked, account for setup, configuration, HTTP or API behavior, templates, or usage examples changed on the current branch.
- Do not force documentation edits for purely internal changes with no user-facing or maintainer-facing impact.
- This repository does not require separate minimal example applications. Prefer focused snippets and links to deeper docs.

## TypeScript and design

- Prefer TypeScript strict-mode compatible code and avoid `any`.
- Prefer explicit names over abbreviations.
- Prefer explicit return types in public functions and services when they improve readability.
- Prefer dependency injection over direct instantiation.
- Prefer object-oriented design for module boundaries, stateful services, integrations, and long-lived domain responsibilities.
- Prefer functional style for pure transformations, parsing, validation, mapping, and small stateless rules.
- Introduce a class only when it adds structure, state, lifecycle, or a clearer boundary.

## Error handling

- Prefer custom domain-specific error classes over the built-in `Error` class directly.
- Use `*Error` by default. Use `*Exception` only when a class is intentionally tied to NestJS exception flow, for example when extending `HttpException`.
- Store constructor input in public readonly fields. Use parameter properties in the constructor to set them.
- Error messages should make it easy to localize the module, config source, or integration that failed.

## Barrel files

- A main barrel file may expose only the stable API of a module or directory.
- Code inside a module or directory must not import from its own main barrel file.
- Internal barrels may be used only in narrow directories where they materially improve readability.
- Do not leak internal helpers, implementation details, test utilities, or transitional exports through barrels.

## Nest.js and boundaries

- Keep controllers thin.
- Keep domain logic out of controllers.
- Prefer explicit service and module boundaries.
- Do not move logic into decorators or guards unless the task clearly benefits from that.
- Prefer predictable provider wiring over clever dynamic registration.
- Prefer static modules over dynamic modules unless there is a strong reason.
- Do not bypass Nest.js dependency injection unless there is a strong reason.
- Use PascalCase file naming instead of Angular-style names.

## Zod

- Prefer Zod schemas at input boundaries.
- Keep schemas close to the DTO or boundary they validate.
- Reuse schemas only when the domain meaning is the same.
- If an input contract changes, update the schema and affected tests.
- Validate data once at the boundary; do not re-validate partial data deeper in the flow.

## Tests and validation

- Preserve the existing repository-specific test architecture under `app/test`.
- Prefer focused unit tests for isolated logic and broader integration or e2e coverage when changes cross module or transport boundaries.
- When fixing a bug, first add a test that reproduces it, then make it pass.
- Prefer this validation order: build or typecheck for the touched area, lint for the touched area, targeted tests, broader validation only if needed.
- At the end of the task, summarize changed files, explain the approach, mention risks or follow-up work, and state exactly what was and was not validated.
