# AGENTS.md

## Repository overview

- This repository hosts a Nest.js application in the `app/` directory 
- The application currently is a staging ground for a website and a backend API of random generators.
- The application's base modules (`app/src/base/*`) were refactored into a set of the NPM packages. They reside in their own monorepo now and are available from https://npm.pkg.github.com and go by the names `@forsetius/glitnir-*`.
- The monorepo with the packages is hosted at https://github.com/forsetius/glitnir. It is also available locally in the `../glitnir` directory.
- Now we're going to refactor the application into using those packages instead of base modules.
- After the refactoring, the application will be moved to a new repository with improved architecture and more features.
- The aim is to have a fully-functional application after the refactoring. No new features will be added to the application, it has to work as previously but using external Glitnir packages.

## Technical defaults

- Prefer TypeScript strict mode compatible code.
- Avoid `any`.
- Prefer explicit return types in public functions and services when useful for readability.
- Prefer dependency injection over direct instantiation.
- Do not bypass Nest.js dependency injection unless there is a strong reason.

## Nest.js conventions

- Keep controllers thin.
- Keep domain logic out of controllers.
- Prefer explicit service boundaries.
- Preserve module boundaries.
- Do not move logic into decorators or guards unless the task explicitly benefits from that.
- Prefer predictable provider wiring over clever dynamic registration.

## Zod conventions

- Prefer Zod schemas at input boundaries.
- Keep schemas close to the DTO or boundary they validate.
- Reuse schemas when the domain meaning is the same; do not reuse them when semantics differ only because the shape looks similar.
- If changing an input contract, update the schema and any affected tests.
- Prefer explicit parsing or safe parsing flows over implicit assumptions.

## Jest conventions

- Prefer focused unit tests for isolated logic.
- Use integration tests when the change crosses module or transport boundaries.
- Do not rewrite unrelated tests.
- When fixing a bug, first create a test that replicates the bug. Only then fix the bug and make the test pass.
- Keep test names descriptive and behavior-focused.

## Change strategy

- First identify the smallest safe change.
- Preserve public APIs unless explicitly asked to change them.
- Do not rename files, exports, or providers unless it improves the task materially.
- Avoid opportunistic refactors unless they directly reduce risk in the touched area.

## Validation

After changes, prefer the narrowest relevant validation:

1. Typecheck for touched package or app
2. Lint for touched package or app
3. Targeted Jest tests
4. Broader test suite only if necessary

## Output expectations

At the end of the task:

- summarize changed files
- explain the implemented approach
- mention risks or follow-up work
- state exactly what was validated
- state what was not validated
