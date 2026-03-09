# Validation — Zod at the Edge, Invariants in the Domain, and Validator Migration

This document explains where validation should happen, which tools should be used, and how the current `Validator` in `@repo/utils` can evolve.

> This document describes a **transition strategy**: part of it reflects the **current state** of the repository, while part of it defines the architectural direction for new code.

---

## Index

- [Summary](#summary)
- [Zod at the Edge](#zod-at-the-edge)
- [Domain Invariants](#domain-invariants)
- [What To Validate Where](#what-to-validate-where)
- [Validator Migration](#validator-migration)

---

## Summary

- **Current state**:
  - `Validator` and `ValidationError` are still used in the domain and in some parts of the project.
  - Web forms may still use `Formik` / `Yup` instead of `Zod`.
- **Target direction**:
  - Zod at the edge
  - explicit invariants in the domain
  - gradual migration away from `Validator` outside areas that still depend on it

- **Edge (API, forms, decoding)**: **Zod** — HTTP input, query, body, and database row decoding.
- **Domain**: **invariants** in constructors and methods; current failures still throw `ValidationError(CODE, message)` in several parts of the codebase.
- **Validator** (`@repo/utils`): still in use **inside the domain** (Core and utils); the **edge** should converge to Zod. `Validator` may remain in the domain for now or be gradually replaced by explicit checks plus stable error contracts.

---

## Zod at the Edge

### Practical Rule

- In **new edge code** (API, forms, external decoding), prefer `Zod`.
- In **legacy code** that still uses `Yup` or `Validator`, migrate only when the change belongs to the task scope.

- **Where**: Route Handlers, forms (replacing or complementing Yup), and row decoding in Infra.
- **How**:
  - **API**: `bodySchema.parse(req.body)` or `querySchema.parse(Object.fromEntries(req.nextUrl.searchParams))`; if parsing fails, Zod throws and the edge converts the failure to a `400` response.
  - **Forms**: use a Zod schema instead of (or alongside) Yup; call `schema.safeParse(values)` or integrate it with form tooling.
  - **Infra**: validate `dbRow` with `rowSchema.parse(dbRow)` before mapping rows into entities / Value Objects.
- **Benefits**: inferred types, composition, custom messages, and structured validation results.

### Example (API)

```ts
const bodyContact = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

const parsed = bodyContact.safeParse(await req.json());
if (!parsed.success) {
  return Response.json(
    { error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } },
    { status: 400 },
  );
}
```

---

## Domain Invariants

- **Where**: constructors and methods of entities and Value Objects in `@repo/core`.
- **How**: explicit checks; in the current implementation, failures often still throw `ValidationError(ERROR_CODE, message)`.
- **Examples**:
  - **`Experience`**: `start_at <= end_at` (when `end_at` exists) — currently implemented with `Validator.combine` and `ValidationError(Experience.ERROR_CODE, error)`.
  - **`Text`**, **`Id`**, **`DateTime`**, etc.: format and length restrictions enforced in constructors with `Validator` and `ValidationError`.
- The domain **does not** use Zod. Data coming from the outside world (HTTP, DB) should be decoded and validated at the edge before it reaches the domain.

> If the target architecture evolves fully toward `Either` instead of `throw` for expected business errors, that transition should be treated as a separate structural migration, not as an ad hoc exception in new code.

---

## What To Validate Where

| Layer | What | Tool |
|-------|------|------|
| **API (body, query)** | Structure, types, formats (email, UUID, dates), lengths | Zod |
| **Forms (web)** | Form fields before submission | Zod (or Yup during migration) |
| **Infra (row decoding)** | Shape of DB rows before mapping | Zod |
| **Domain (constructor, methods)** | Invariants (for example, `start_at <= end_at`), VO rules (UUID, min/max) | Current `Validator`, or explicit checks with a stable error contract |

---

## Validator Migration

### Current State

- **`Validator`** and **`ValidationError`** live in `@repo/utils`.
- **Usage**: `@repo/core` (`Id`, `Text`, `DateTime`, `Experience`, etc.) and possibly `@repo/utils` itself.
- **Validations** in `@repo/utils`: `isLength`, `isUUID`, `isDateTime`, `isIn`, `isUrl`, and others used by `Validator`.

### Strategy

1. **Edge (API, forms, Infra)**
   - Introduce **Zod** for:
     - body / query validation in Route Handlers
     - form schemas (gradually replacing Yup where it makes sense)
     - row decoding in Infra
   - Do **not** use `Validator` in new edge code.

2. **Domain**
   - Keep `Validator` in the Core for now if it reduces migration risk.
   - In new VOs / entities, explicit invariant checks may be used if they simplify the code and still preserve stable error semantics.
   - Avoid introducing Zod into `@repo/core`.

3. **Utils**
   - Pure validation functions such as `isLength`, `isUUID`, and similar may remain.
   - `Validator` itself may eventually become Core-only legacy infrastructure or be phased out gradually.

4. **Suggested order**
   - (1) Zod in the API (body / query)
   - (2) Zod in Infra row decoding
   - (3) evaluate Zod in forms such as Contact
   - (4) optionally simplify new domain code toward explicit invariants plus stable errors

### What Not To Do

- Do **not** add Zod as a dependency of `@repo/core`.
- Do **not** break existing `ERROR_CODE` contracts during migration.
- Do **not** mix unrelated validation migrations into tasks that are not already touching the validation boundary in question.
