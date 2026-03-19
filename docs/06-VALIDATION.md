# 06 — Validation

> Where validation happens, which tools to use, and the Validator migration strategy.

---

## Summary

| Layer | What | Tool |
|-------|------|------|
| **API (body, query)** | Structure, types, formats, lengths | Zod |
| **Forms (web)** | Form fields before submission | Zod (or Yup during migration) |
| **Infra (row decoding)** | Shape of DB rows before mapping | Zod |
| **Domain (VO, entity constructors)** | Invariants (e.g., `start_at <= end_at`) | `Validator` from `@repo/utils` |

**Core principle**: the domain **does not** use Zod. External data is decoded at the edge before it reaches the domain.

---

## Zod at the Edge

Use Zod in **new edge code** (API Routes, forms, Infra row decoding):

```typescript
// API body validation
const bodySchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

const parsed = bodySchema.safeParse(await req.json());
if (!parsed.success) {
  return Response.json(
    { data: null, error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } },
    { status: 400 },
  );
}
```

In **legacy code** still using Yup or `Validator`, migrate only when the change belongs to the task scope.

---

## Domain Invariants

The domain enforces invariants via `Validator` from `@repo/utils` and returns errors using the Either pattern:

```typescript
// VO using Validator
static create(raw?: string): Either<ValidationError, Slug> {
  const normalized = raw?.trim().toLowerCase() ?? '';
  const { error, isValid } = Validator.of(normalized)
    .length(3, 100, 'Slug must be at least 3 characters.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case.')
    .validate();
  if (!isValid && error)
    return left(new ValidationError({ code: Slug.ERROR_CODE, message: error }));
  return right(new Slug(normalized));
}
```

`Validator` methods:

| Method | Description |
|--------|-------------|
| `.length(min, max, error)` | String length between `min` and `max` |
| `.notEmpty(error)` | Non-empty string |
| `.empty(error)` | Empty string |
| `.alpha(error)` | Alphabetic characters only (supports accents) |
| `.string(error)` | Valid string type |
| `.regex(pattern, error)` | Matches regular expression |
| `.url(error)` | Valid URL |
| `.uuid(error)` | Valid UUID |
| `.datetime(error)` | Valid ISO 8601 datetime |
| `.in(values, error)` | Value must be one of the allowed values |
| `.gt(n, error)` / `.gte(n, error)` | Number greater than / greater than or equal to `n` |
| `.lt(n, error)` / `.lte(n, error)` | Number less than / less than or equal to `n` |
| `.nil(error)` | Value is `null` or `undefined` |
| `.notNil(error)` | Value is not `null` or `undefined` |
| `.refine(predicate, error)` | Arbitrary predicate function |
| `Validator.combine(...validators)` | Runs multiple validators; returns first error |

---

### Enum and primitive invariants in entities

For simple enum or primitive properties that do not warrant a dedicated VO, validate directly in `create()` using `Validator` — no need to wrap in a VO:

```typescript
// ✅ enum validated in entity create() — no VO needed
{
  const { error, isValid } = Validator.of(props.status)
    .in(Object.values(ProjectStatus), 'Invalid status.')
    .validate();
  if (!isValid && error)
    return left(new ValidationError({ code: Project.ERROR_CODE, message: error }));
}
```

See [CLAUDE.md — Entity properties: VO vs primitive + Validator](../CLAUDE.md) for the full decision rule.

---

## What Not To Do

- Do **not** add Zod as a dependency of `@repo/core`
- Do **not** break existing `ERROR_CODE` contracts during migration
- Do **not** use raw `if` guards for validation — use `Validator` in domain code
- Do **not** mix Zod and Validator in the same layer

---

## Validator Migration Status

- `Validator.new` → `Validator.of` ✓ (Sprint 1, PR #338)
- Added `.notEmpty()`, `.regex()`, `.refine()` ✓ (Sprint 1, PR #338)
- All domain VOs and entities use `Validator` instead of raw `if` guards ✓ (Sprint 1, PR #339)
- Zod-backed internals in `Validator` ✓ (Sprint 1, PR #338)

---

## See Also

- **[05-API-CONTRACTS](./05-API-CONTRACTS.md)** — Edge error mapping
- **[09-PATTERNS](./09-PATTERNS.md)** — Either pattern and VO templates
