# Error Handling — Codes in the Core, Mapping at the Edge, and i18n

Error strategy: **stable codes in the domain**, mapping to **HTTP**, and **translated messages** at the edge (web / API).

---

## Index

- [DomainError / ValidationError and Codes in the Core](#domainerror--validationerror-and-codes-in-the-core)
- [HTTP Mapping and Envelope](#http-mapping-and-envelope)
- [Message Translation](#message-translation)
- [Examples](#examples)

---

## DomainError / ValidationError and Codes in the Core

- **`ValidationError`** (currently from `@repo/utils` in some areas): may be built with a stable `code` and an optional `message`.
- **Usage in the Core**: when a VO, entity, or invariant fails, the current implementation still throws `ValidationError(ERROR_CODE, message)` in several places.
  - Examples: `Id.ERROR_CODE = 'ERROR_INVALID_ID'`, `Text.ERROR_CODE = 'ERROR_INVALID_TEXT'`, `Experience.ERROR_CODE = 'ERROR_INVALID_EXPERIENCE'`.
- **`ERROR_MESSAGE`** (`@repo/core`): map like `{ 'pt-BR': { [code]: { code, message } }, 'en-US': { ... } }` for stable codes such as `INVALID_DATE_TIME`, `INVALID_ID`, and `INVALID_NAME`. Other codes (for example, `ERROR_INVALID_TEXT`) may rely on `ValidationError.message` or extra dictionaries at the edge.
- The Core **does not choose locale**; it throws or returns a stable **code**, with an optional internal-language `message` useful for logs and fallback.

---

## HTTP Mapping and Envelope

At the **edge** (Route Handlers, controllers, or error wrappers in web / API):

1. **Catch** `ValidationError` and other domain / application errors.
2. **Map code → HTTP status**:
   - `ERROR_INVALID_*`, `ERROR_INVALID_ID`, `ERROR_INVALID_TEXT`, `ERROR_INVALID_EXPERIENCE`, etc. → **400**
   - `NOT_FOUND` → **404**
   - unmapped error / infra failure → **500**
3. **Return an error envelope** such as `{ "error": { "code": "string", "message": "string" } }`.
4. **Resolve `message`** using i18n from the **code** and the request **locale** (`Accept-Language`, `?locale=`, cookie, etc.). If no entry exists, use `ValidationError.message` or a generic fallback.

---

## Message Translation

- **Source**: `ERROR_MESSAGE` in `@repo/core` (`pt-BR`, `en-US`) and edge-specific extensions for codes that belong outside the Core (for example, `NOT_FOUND`).
- **Language**: taken from the request (`Accept-Language`, `?locale=pt-BR`, cookie, or session depending on the app).
- **Fallback**: if there is no entry for the locale, use `en-US` or `pt-BR`; if still missing, use `error.message` or a generic fallback such as `"Unexpected error"`.

---

## Examples

### Error Payload (API)

**400 — validation**

```json
{
  "error": {
    "code": "ERROR_INVALID_ID",
    "message": "The id must be a UUID."
  }
}
```

**404**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found."
  }
}
```

**500**

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal error. Please try again later."
  }
}
```

### Frontend Display (toast / error page)

- **Forms** (for example, Contact): when receiving `400` with `error.code` and `error.message`, show `error.message` in a toast or next to the field. The API may already return the message localized for the current request.
- **Pages** (for example, missing project): when receiving `404`, render a not-found page with `error.message` or a `next-intl` key such as `t('Errors.notFound')`.
- **Generic failures**: for `500` or network failures, show a generic message translated by `next-intl`.

### Mapping Snippet (edge pseudocode)

```ts
try {
  const result = await getProjectById(id);
  return Response.json({ data: result });
} catch (e) {
  if (e instanceof ValidationError) {
    const status = 400;
    const message = translateError(e.name, locale) ?? e.message;
    return Response.json({ error: { code: e.name, message } }, { status });
  }

  if (e.code === 'NOT_FOUND') {
    return Response.json(
      { error: { code: 'NOT_FOUND', message: t('Errors.notFound') } },
      { status: 404 },
    );
  }

  return Response.json(
    { error: { code: 'INTERNAL_ERROR', message: t('Errors.internal') } },
    { status: 500 },
  );
}
```

`translateError(code, locale)` may read `ERROR_MESSAGE[locale][code]?.message` and merge additional edge-level entries such as `NOT_FOUND` and `INTERNAL_ERROR`.
