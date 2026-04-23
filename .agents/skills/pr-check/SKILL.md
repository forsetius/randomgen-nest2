---
name: pr-check
description: Use when local changes in this repository need a pre-PR or pre-push audit. Run app-local validation first, stop on failures, then review module boundaries, Glitnir package adoption impact, config and schema drift, docs and JSDoc, dependency hygiene, accidental residue, and decide whether the branch is ready for PR.
---

# PR Check

Use this skill for branch-level readiness audits before opening a pull request or before pushing the remaining local commits.

Default to a read-only audit. Fix issues only when the user explicitly asks for remediation.

## Required outcome

Your final response must include:

- `Status:` `Ready for PR` or `Not ready for PR`
- `Validation:` exact commands run and whether they passed, failed, or were skipped
- `Findings:` ordered by priority with file references when useful
- `Recommended fix:` one concrete recommendation for each finding
- `Alternatives:` only when there is a meaningful tradeoff
- `Additional checks to consider:` short optional suggestions beyond the current checklist

Use only these priority levels:

- `P0`: hard blocker, branch is unsafe to push or open as PR
- `P1`: should be fixed before PR
- `P2`: worthwhile improvement, usually non-blocking
- `P3`: minor cleanup or follow-up

`Ready for PR` is allowed only when the validation gate passes and there are no `P0` or `P1` findings.

## Establish scope

Check both uncommitted work and local commits that may not be pushed yet.

Start with:

- `git status --short`
- `git diff --stat`
- `git diff --cached --stat`
- `git log --oneline @{upstream}..HEAD` when an upstream branch exists

If `@{upstream}` is unavailable, compare against the likely base branch, for example `origin/main...HEAD`.

Do not ignore committed local changes just because the worktree is clean. A pre-PR audit is about the whole branch delta.

If the worktree contains unrelated user changes, do not revert them. Limit the audit to the current branch scope and state any ambiguity explicitly.

## Hard validation gate

Run the gate from `app/`.

Prefer this order:

- `npm run build`
- `npm run lint`
- the narrowest relevant test command for the changed scope

Choose the test command based on scope instead of forcing one universal default. Prefer:

- `npm run test:unit` for isolated domain, service, utility, mapper, DTO, or config logic
- `npm run test:e2e:parallel` when HTTP or transport behavior is affected and parallel e2e coverage is sufficient
- `npm run test:e2e:serial` when the affected flow depends on shared global state or ordering
- `npm run test` only when narrower commands would miss important coverage

If the relevant test command is unclear, explain the assumption and pick the narrowest defensible option.

If the validation gate fails:

1. stop the audit
2. report `Status: Not ready for PR`
3. summarize the failing stage and likely root cause
4. do not continue with subjective design review unless the user explicitly asks to continue despite the failed gate

## Audit checklist after the gate passes

### Architecture and boundaries

Check whether the branch preserves repository boundaries:

- controllers remain thin
- domain logic does not leak into controllers, decorators, or guards
- `app`, `domain`, `shared`, and legacy `base` areas stay coherent
- DI wiring stays explicit and predictable
- new wrappers or abstractions add real value

### Glitnir adoption impact

When the branch replaces logic from `app/src/base/*` with `@forsetius/glitnir-*` packages, check:

- old local code is not left behind in a conflicting or partially migrated state
- local config, DI wiring, templates, DTOs, or schemas were migrated consistently
- affected local consumers, docs, and relevant tests were updated where the integration surface changed
- temporary adapters are not being turned into permanent architecture without a clear reason

### Configuration and Zod contracts

Check:

- environment bindings, config contracts, module options, DTOs, and schemas stay aligned
- validation still happens at the boundary
- invalid input or invalid config still produces actionable, localizable errors

### Documentation and JSDoc completeness

When setup, configuration, behavior, or examples changed, review the touched area against:

- `.agents/skills/package-docs/SKILL.md`
- `.agents/skills/jsdoc-docs/SKILL.md`

Flag stale README content, stale snippets, missing docs updates, and missing JSDoc for non-trivial public APIs.

### Dependency hygiene

Review dependency changes carefully.

Check:

- whether a new dependency is justified
- whether an existing dependency or built-in API would be sufficient
- whether `app/package-lock.json` changes are intentional and proportionate
- whether runtime versus development dependency placement is correct

### TODO and residue scan

Search the changed scope for leftover artifacts that do not belong in the branch.

At minimum check for:

- merge conflict markers
- debug logs and ad hoc tracing
- commented-out code
- hard-coded secrets or credentials
- temporary files and scratch artifacts
- newly introduced `TODO` or `FIXME` markers that are not clearly intentional

### Performance and observability

When the branch touches hot paths, repeated flows, startup, I/O-heavy paths, or instrumentation, review:

- unnecessary allocations, parsing, or repeated computation
- synchronous or repeated I/O in sensitive paths
- logs that are noisy, misleading, or leak sensitive data
- metrics or tracing changes that weaken diagnosis or create noise

Do not force speculative micro-optimizations. Report only meaningful risks relative to the changed path.

## Reporting rules

Findings come before the summary.

For each finding include:

- priority
- short title
- why it matters
- the affected file or area
- the recommended fix
- alternatives only when they represent a real tradeoff
