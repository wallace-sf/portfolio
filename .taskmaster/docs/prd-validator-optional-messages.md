# PRD — Validator: make message params optional and fix chain loop

## Background

The `Validator` fluent API in `packages/utils` requires a `message: string` in every
rule call (`.refine()`, `.length()`, `.regex()`, `.email()`, `.notEmpty()`, `.in()`,
`.notNil()`). This was correct when error messages were resolved at the domain layer
and flowed into `ValidationError.message`.

After the i18n refactor (PR #597), message resolution moved to the application layer
via `toErrorDTO` + `ERROR_MESSAGE`. Call sites now only read `isValid` from
`.validate()` and construct `new ValidationError({ code })` — the `error` string
returned by `.validate()` is no longer used anywhere in `core` or `application`.

Because the param is still required, every call site had to pass *something*. This
produced two waves of workarounds:
1. Hardcoded English strings (original) — violated i18n.
2. Mock placeholder strings (`'invalid-slug'`, `'self-reference'`, etc.) — current
   state. They are truthy (needed to avoid a latent bug in the chain loop) but carry
   no semantic value.

A latent bug was also discovered: the `validate()` loop uses `if (this._error) break`,
which silently skips the break when `_error` is an empty string `''`, allowing a later
rule to overwrite a previous failure.

## Goals

1. Make `message` optional in all Validator rule methods.
2. Fix the chain-loop bug so failure detection does not depend on message truthiness.
3. Remove all mock placeholder strings from `core` and `application` call sites.
4. Keep the public `validate()` return type (`{ isValid, error }`) stable — no
   downstream breaking changes.

## Out of scope

- Changing `.validate()` to return `{ isValid, code }` instead of `{ isValid, error }`
  (tracked separately as a future discussion in issue #598).
- Updating `apps/site` route-handler validators (`.notNil`, `.refine` on JSON body) —
  those are HTTP-boundary validators that intentionally carry messages.

## Technical design

### 1. Fix the chain loop in `Validator.validate()`

Replace the truthy-string guard with an explicit boolean flag:

```typescript
// before
this._error = isValid ? null : error;
if (this._error) break;

// after
this._failed = !isValid;
this._error = isValid ? null : (error ?? 'validation-error');
if (this._failed) break;
```

This ensures that a failed rule always stops the chain, regardless of the message value.

### 2. Make `message` optional in all rule methods

```typescript
// before
refine(fn: (v: T) => boolean, message: string): this

// after
refine(fn: (v: T) => boolean, message?: string): this
```

Apply the same change to: `.length()`, `.regex()`, `.email()`, `.notEmpty()`,
`.notNil()`, `.in()`, and any other rule method.

Internally, default to `'validation-error'` when no message is provided so `_error`
remains non-null on failure (useful if callers still read `error` from `.validate()`).

### 3. Remove mock placeholders from call sites

After steps 1 and 2, all call sites in `core` and `application` that currently pass
mock placeholders can drop the second argument entirely:

```typescript
// before
.refine((v) => isLocale(v), 'invalid-locale')
.length(3, 100, 'invalid-slug')

// after
.refine((v) => isLocale(v))
.length(3, 100)
```

## Affected files

### `packages/utils`
- `src/validator/Validator.ts` — fix loop, make params optional

### `packages/core`
- `src/shared/vo/Slug.ts`
- `src/shared/vo/Email.ts`
- `src/shared/vo/Name.ts`
- `src/shared/vo/Text.ts`
- `src/shared/vo/Url.ts`
- `src/shared/vo/Id.ts`
- `src/shared/vo/DateTime.ts`
- `src/shared/vo/DateRange.ts`
- `src/shared/i18n/LocalizedText.ts`
- `src/shared/validateEnum.ts`
- `src/portfolio/entities/language/model/Language.ts`
- `src/portfolio/entities/profile/model/Profile.ts`
- `src/portfolio/entities/project/model/Project.ts`
- `src/portfolio/entities/skill/factory/SkillFactory.ts`

### `packages/application`
- `src/contact/use-cases/SendContactMessage.ts`

## Testing strategy

- Unit tests for `Validator` must cover:
  - Single rule with no message: failure returns `isValid = false`
  - Chained rules with no message: first failure stops the chain (second rule not evaluated)
  - Mixed: some rules with message, some without
- All existing VO/entity/use-case tests must pass without modification.
- No new tests required for call sites (removing an argument is not behaviour-changing).
