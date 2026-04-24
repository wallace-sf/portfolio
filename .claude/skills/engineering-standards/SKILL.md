---
name: engineering-standards
description: Apply DDD, Clean Architecture, Either pattern, validation, and testing standards. Use when implementing features, entities, value objects, use cases, or when no other skill clearly applies.
---

# Engineering Standards (DDD / Clean Architecture)

## Use when

- User asks to implement features, entities, value objects, use cases, repositories, or API contracts.
- User mentions **DDD**, **Clean Architecture**, **Either**, **Validator**, **Value Object**, **Entity**, **bounded context**, **dependency rule**, or layer boundaries.
- No other skill (task-master, vscode-rules, self-improve) clearly matches the request — treat as default for implementation work.

## Reference (single source of truth)

- Root [CLAUDE.md](../../../CLAUDE.md) — role, monorepo structure, dependency rule, DDD templates (Either, VO, Entity), anti-patterns, general standards
- [docs/INDEX.md](../../../docs/INDEX.md) — documentation map
- [docs/02-ARCHITECTURE.md](../../../docs/02-ARCHITECTURE.md) — layers and ESLint enforcement
- [docs/06-VALIDATION.md](../../../docs/06-VALIDATION.md) — Validator and domain validation
- [docs/09-PATTERNS.md](../../../docs/09-PATTERNS.md) — Either, VO, Entity, Repository, collect()
- [docs/08-TESTING.md](../../../docs/08-TESTING.md) — testing strategy and naming

Do not duplicate long content here; use the references above for full templates and rules.

## Mandatory: tests ship with the code

**Every implementation task must include tests committed in the same branch and PR.**

- New gateway, adapter, or infra class → integration/unit tests for all public methods (happy path + error paths)
- New use case → unit tests with fake ports
- New port interface → contract tests using a fake implementation
- New entity or value object → unit tests covering valid construction and all validation error cases

A PR that adds production code without tests is **not done**. Do not open the PR, do not mark the task as done, do not move on to the next task until tests exist and pass.

> Rationale: `SupabaseAuthenticationGateway` was shipped in one commit without tests, requiring a second commit to add them. This rule prevents that pattern.
