# Testing Strategy

This document defines how the monorepo test suites should be organized, what each layer should cover, and which criteria we use to consider the suite trustworthy.

---

## Summary

- `packages/core`: use **Vitest** for fast, deterministic, behavior-oriented domain tests.
- `apps/web`: keep **Jest** temporarily for React / DOM tests, while ensuring `.test.tsx` discovery stays correct.
- `packages/utils`: keep **Jest** while the `node` / `browser` split still exists.
- Builders are allowed as ergonomics, not as a source of randomness.
- Domain tests must protect invariants, composition, and error propagation.

---

## Layer Strategy

| Layer | Current runner | What to test | What to avoid |
|-------|----------------|--------------|---------------|
| `packages/core` | Vitest | Value Objects, Entities, factories, invariants, composition, domain errors | Tests that only check `instanceof` or echo props without protecting a rule |
| `apps/web` | Jest + jsdom | Critical components, rendering, interaction, important visual contracts, small UI integrations | Low-value smoke tests, tests tightly coupled to component internals |
| `packages/utils` | Jest | Pure functions, edge cases, `node` / `browser` compatibility | Duplicating coverage already provided by a third-party library |

### Recommended Direction

- In the short term, a mixed-runner strategy is acceptable:
  - `Vitest` in the domain
  - `Jest` where `jsdom` and existing config are already stable
- In the medium term, it is reasonable to evaluate convergence toward `Vitest`, but only after discovery and coverage strategy are stable across packages.

---

## Folder Architecture

### Recommended Current Convention

- `packages/core/test/...` for domain tests
- `packages/utils/test/node/...` and `packages/utils/test/browser/...` where environment changes behavior
- `apps/web/tests/...` for web application tests

### Conventions

- Name files as `*.test.ts` or `*.test.tsx`
- Group tests by domain or module, not by assertion type
- Keep fixtures / builders in `test/data/` only when they reduce setup noise

---

## Builders and Fixtures

Builders make sense in this repository, but with clear limits:

- They must have deterministic, semantically clear defaults.
- They must not use random data by default.
- They should improve readability of the scenario rather than hide it.
- In important domain tests, prefer declaring the relevant data explicitly inside the test itself.

### Good Usage

- `ProjectBuilder.build().withTitle('Portfolio API').withSkills([])`
- Builders that reduce repetitive setup for `id`, timestamps, and neutral props

### Bad Usage

- Builders that choose random enum values
- Builders that generate lists with random length
- Tests that pass only because the builder always produces some vague “valid” scenario

---

## Value Objects

Each Value Object should be tested by observable behavior:

- valid creation with representative input
- rejection of invalid input
- normalization
- equality and difference
- immutability

### Good Examples

- `LocalizedText` falls back to `pt-BR`
- `Name` normalizes spaces
- `DateTime` exposes `ms` correctly
- `SkillType` rejects values outside its enum

### Low-Value Examples

- repeating “instantiates correctly” in multiple variations without protecting a new rule
- testing implementation details instead of public contract

---

## Entities and Aggregates

Entities should be tested as domain boundaries:

- correct composition of Value Objects
- aggregate-specific invariants
- behavior with empty lists when that is valid
- propagation of errors from invalid children
- explicit handling of missing or malformed input

### What To Test

- `Experience` rejects `start_at > end_at`
- `Project` accepts `skills: []` if an empty list is valid
- aggregates reject missing `skills` with a domain-shaped error
- an invalid `Skill` error reaches the caller instead of turning into a generic `TypeError`

### What To Avoid

- tests that only assert every property was copied into a field with the same name
- redundant list tests such as “creates two entities” when no business rule is involved

---

## Error Assertions

Prefer validating the error contract, not just a literal message.

Recommended priority:

1. error type
2. `code`
3. relevant `message` fragment, when needed

This reduces brittleness when wording changes without changing the business rule.

---

## What Does Not Need Testing

- simple re-exports
- trivial getters without rules
- passive prop mapping that does not protect behavior
- internal details already covered by tests closer to the rule

---

## Checklist For New Tests

- The test name describes a real rule or behavior.
- The scenario uses deterministic data.
- The test would fail if the rule were broken.
- The assertion validates contract, not incidental detail.
- The test is written at the correct level: VO, Entity, factory, or UI.
- The test avoids duplicating coverage from another level without a good reason.

---

## Continuous Verification

- Run `pnpm test` at the root to validate integration with `turbo`
- Run the changed package suite during implementation
- Use coverage as a supporting signal, not as the main goal
- Prefer small, predictable, fast tests
