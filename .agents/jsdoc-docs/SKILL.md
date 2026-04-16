---
name: jsdoc-docs
description: Use when public APIs or non-trivial internal code in this monorepo need JSDoc that explains behavior, thrown errors, complex typing, defaults, or links to deeper package documentation.
---

# JSDoc Docs

Use this skill for JSDoc work in this repository.

## When to add JSDoc

Add JSDoc to:

- public APIs
- non-trivial internal functions
- non-trivial internal classes, methods, or properties

Do not add JSDoc to obvious code just to repeat the signature.

## Content rules

- Write comments in English.
- Explain behavior that is not obvious from the signature.
- Explain non-trivial typing when it helps the reader.
- Do not add redundant `@param` text when the parameter name, type, and role are already obvious.
- Document thrown exceptions briefly when a function throws them.
- If there is a useful example in the documentation, link to it.
- If there is a deeper explanation in `docs/`, link to it.

## Scope rules

- Prefer a short, precise JSDoc over a verbose one.
- Keep business or architectural essays out of JSDoc. Put those into `docs/` and link to them.
- When public API changed, review the nearby JSDoc for stale statements.

## Validation

- Make sure JSDoc does not contradict the code.
- If a change updates exceptions, defaults, or configuration behavior, update the related JSDoc in the same task when practical.
