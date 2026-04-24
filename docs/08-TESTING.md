# 08 — Testing

> Test strategy, suite organization, TDD cycle, builders, and quality criteria.

---

## Stack

| Layer | Runner | Notes |
|-------|--------|-------|
| `packages/core` | **Vitest** | Fast, deterministic domain tests |
| `packages/utils` | **Vitest** | `node` / `browser` split via `environmentMatchGlobs` |
| `apps/web` | **Vitest + Testing Library + jsdom** | UI components, rendering, interaction |
| E2E | **Playwright** | Main user flows (when surface area justifies) |

---

## TDD Cycle — Mandatory

**Red → Green → Refactor**

Write a failing test first, make it pass with the minimum code, then refactor.

---

## What to Test by Layer

| Layer | Focus | Avoid |
|-------|-------|-------|
| `packages/core` | Invariants, VO creation/rejection, entity composition, error propagation, factories | Tests that only check `instanceof` or echo props without protecting a rule |
| `packages/application` | Use cases with mocked repositories; orchestration logic | Duplicating domain invariant tests |
| `apps/web` | Critical components, rendering, interaction, important visual contracts | Low-value smoke tests, tests tightly coupled to internals |
| `packages/utils` | Pure functions, edge cases, environment compatibility | Duplicating third-party library coverage |

---

## Folder Organization

```text
packages/core/test/             → Domain unit tests
packages/utils/test/node/       → Node-environment utils
packages/utils/test/browser/    → Browser-environment utils
apps/web/tests/                 → Web application tests
```

File naming: `*.test.ts` or `*.test.tsx`

---

## Value Objects

Test every VO for observable behavior:

- ✅ Valid creation with representative input
- ✅ Rejection of invalid input
- ✅ Normalization (e.g., `Name` trims and normalizes whitespace)
- ✅ Equality and difference
- ✅ Immutability

**Good examples:** `LocalizedText` falls back to `pt-BR`; `DateTime` exposes `ms` correctly; `SkillType` rejects out-of-enum values.
**Avoid:** repeating "instantiates correctly" without protecting a real rule.

---

## Entities and Aggregates

Test as domain boundaries:

- ✅ Correct composition of Value Objects
- ✅ Aggregate-specific invariants
- ✅ Behavior with empty lists when valid
- ✅ Propagation of errors from invalid children
- ✅ Explicit handling of missing or malformed input

**Good examples:** `Experience` rejects `start_at > end_at`; `Profile` rejects more than 6 featured projects.
**Avoid:** tests that only assert every property was copied to a field with the same name.

---

## Error Assertions

Prefer validating the error contract:

```typescript
// ✅ Preferred order:
expect(result.isLeft()).toBe(true);
expect(result.value).toBeInstanceOf(ValidationError);  // 1. type
expect(result.value.code).toBe('INVALID_SLUG');        // 2. code
// 3. message fragment only when needed
```

This reduces brittleness when error wording changes without changing the business rule.

---

## Builders and Fixtures

Builders are allowed for ergonomics, but with strict rules:

- **Must** have deterministic, semantically clear defaults
- **Must not** use random data
- Should improve readability of the scenario, not hide it
- In important domain tests, prefer declaring relevant data explicitly inside the test

```typescript
// ✅ Good
ProjectBuilder.build().withSlug('my-project').withSkills([])

// ❌ Bad — random enum, hides the scenario
ProjectBuilder.buildRandom()
```

---

## Test Template

```typescript
describe('<Subject>', () => {
  it('should <expected behavior> when <context>', () => {
    const result = Subject.create({ /* explicit, deterministic data */ });

    expect(result.isRight()).toBe(true);
  });

  it('should return error when <invalid condition>', () => {
    const result = Subject.create({ /* invalid data */ });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ValidationError);
    expect(result.value.code).toBe('EXPECTED_ERROR_CODE');
  });
});
```

---

## What Does Not Need Testing

- Simple re-exports
- Trivial getters without rules
- Passive prop mapping that does not protect behavior
- Internal details already covered by tests closer to the rule

---

## Checklist for New Tests

- [ ] The test name describes a real rule or behavior (`should ... when ...`)
- [ ] The scenario uses deterministic data
- [ ] The test would fail if the rule were broken
- [ ] The assertion validates contract, not incidental detail
- [ ] The test is at the correct level: VO, Entity, factory, or UI

---

## Continuous Verification

```bash
# Run the changed package suite during implementation
pnpm --filter @repo/core test

# Run full suite before concluding work
pnpm test
```

Use coverage as a supporting signal, not as the primary goal.

---

## See Also

- **[09-PATTERNS](./09-PATTERNS.md)** — Either pattern and VO/Entity templates
- **[06-VALIDATION](./06-VALIDATION.md)** — Domain invariants and Validator usage
