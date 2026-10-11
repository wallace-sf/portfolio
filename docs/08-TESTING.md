# 08 — Testing

> Test strategy, suite organization, TDD cycle, builders, and quality criteria.

---

## Stack

| Layer | Runner | Notes |
|-------|--------|-------|
| `packages/core` | **Vitest** | Fast, deterministic domain tests |
| `packages/utils` | **Vitest** | `node` / `browser` split via `environmentMatchGlobs` |
| `apps/site` | **Vitest + Testing Library + jsdom** | UI components, rendering, interaction |
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
| `apps/site` | Critical components, rendering, interaction, important visual contracts | Low-value smoke tests, tests tightly coupled to internals |
| `packages/utils` | Pure functions, edge cases, environment compatibility | Duplicating third-party library coverage |

---

## Folder Organization

```text
packages/core/test/             → Domain unit tests
packages/core/src/testing/      → Shared test-data builders (@repo/core/testing)
packages/infra/test/factories/  → Prisma row / create-input factories
packages/utils/test/node/       → Node-environment utils
packages/utils/test/browser/    → Browser-environment utils
apps/site/tests/                → Site application tests
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

## Builders and Factories

Test data comes from two kinds of helpers. Don't hand-roll `BASE_PROPS` +
`makeX()` in a test file; extend the shared helper instead.

| | **Builders** | **Factories** |
|---|---|---|
| Produce | **Domain entities** (`BlogPost`, `Project`, `User`, …) | **Persistence shapes**: Prisma rows and create inputs |
| Go through | `Entity.create()`, so invalid data throws at setup | Nothing: plain objects |
| Live in | `packages/core/src/testing/builders/`, imported as `@repo/core/testing` | `packages/infra/test/factories/` |
| Naming | `XBuilder.build().withY(…).now()` | `buildPrismaX(overrides)` / `buildPrismaXCreateInput(overrides)` |
| Used by | `core`, `application`, `apps/*` tests | `infra` mapper and repository tests |

```typescript
import { BlogPostBuilder, unwrap, UserBuilder } from '@repo/core/testing';

const post = BlogPostBuilder.build().withSlug('hello-world').now();
const admin = UserBuilder.build().now();
const slug = unwrap(Slug.create('hello-world')); // throws if the fixture is invalid
```

### Rules

- **Test code only.** `@repo/core/testing` ships inside `@repo/core` (a subpath
  export, so `core` tests use it without a package cycle). Production code must
  never import it: ESLint `no-restricted-imports` rejects it in every `src/`, and
  inside `core` it also rejects relative imports of `src/testing` from domain
  code (`packages/eslint-config/restricted-imports.js`).
- **Deterministic, meaningful defaults.** Builders and factories must produce
  the same values every run, chosen so the scenario reads clearly.
- **Random only for opaque identifiers.** A generated value (`crypto.randomUUID()`)
  is allowed only where the test never reads the value and it only has to be
  unique: ids, and the unique suffix of a slug or e-mail in integration tests
  that share a database. Never randomize a value the test asserts on, and never
  pick a random enum value.
- **Readability over brevity.** In important domain tests, still declare the
  data that matters to the scenario explicitly (`.withStatus(...)`), even if
  it equals the default.
- **One create-input mapping per model.** Integration suites persist rows with
  the factory's `buildPrismaXCreateInput`, never a per-suite conversion.
- **`unwrap(result)`** replaces `if (result.isLeft()) throw …` in test setup.
- **Test doubles** for `application` ports (repository stubs, fakes) are not
  covered here yet: see #1136.

```typescript
// ✅ Good
ProjectBuilder.build().withSlug('my-project').withSkills([])

// ❌ Bad — random enum, hides the scenario
ProjectBuilder.buildRandom()

// ❌ Bad — per-file copy of what the builder already does
const BASE_PROPS: IBlogPostProps = { /* … */ };
function makeBlogPost(overrides = {}) { /* … */ }
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
