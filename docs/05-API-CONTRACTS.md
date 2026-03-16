# 05 — API Contracts

> Response envelope, error handling, HTTP status mapping, and planned endpoints.

---

## Response Envelope

All API responses follow a consistent envelope:

**Success:**
```json
{ "data": <T>, "error": null, "meta": { "total": 42 } }
```

**Failure:**
```json
{ "data": null, "error": { "code": "ERROR_INVALID_ID", "message": "The id must be a UUID." } }
```

---

## HTTP Error Mapping

| Domain error | HTTP status |
|--------------|-------------|
| `ValidationError` / `DomainError` | 400 |
| `NotFoundError` | 404 |
| Unexpected / infrastructure | 500 |

---

## Error Codes

The domain uses **stable error codes** (e.g., `INVALID_SLUG`, `INVALID_DATE_RANGE`). The edge maps them to HTTP status and resolves a localized message.

Examples:

| Code | HTTP | Meaning |
|------|------|---------|
| `ERROR_INVALID_ID` | 400 | UUID format violated |
| `ERROR_INVALID_TEXT` | 400 | Text length constraint violated |
| `INVALID_SLUG` | 400 | Slug format violated |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Error Handling at the Edge

```typescript
try {
  const result = await getProjectBySlug(slug);
  if (result.isLeft()) {
    const { code } = result.value;
    const status = code === 'NOT_FOUND' ? 404 : 400;
    const message = translateError(code, locale) ?? result.value.message;
    return Response.json({ data: null, error: { code, message } }, { status });
  }
  return Response.json({ data: result.value, error: null });
} catch {
  return Response.json(
    { data: null, error: { code: 'INTERNAL_ERROR', message: t('Errors.internal') } },
    { status: 500 },
  );
}
```

`translateError(code, locale)` reads `ERROR_MESSAGE[locale][code]?.message` from `@repo/core`.

---

## Message Translation

- **Source**: `ERROR_MESSAGE` in `@repo/core` (`pt-BR`, `en-US`)
- **Language**: resolved from request (`Accept-Language`, `?locale=`, cookie)
- **Fallback**: `en-US` → `pt-BR` → `error.message` → generic fallback

---

## Planned Endpoints

### Projects

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/projects` | List published projects |
| `GET` | `/api/v1/projects/:slug` | Get project by slug |
| `GET` | `/api/v1/projects/featured` | List featured projects |

### Blog _(post-MVP)_

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/posts` | List posts (`?tag=`, `?limit=`, `?offset=`) |
| `GET` | `/api/v1/posts/:slug` | Get post by slug |
| `GET` | `/api/v1/tags` | List tags |

### Contact

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/contact` | Submit contact form |

---

## Next.js App Router Rules

- Use `next/navigation`; never `next/router`
- Always use `next/image`; never `<img>`
- Always use `next/link`; never `<a>` for internal navigation
- Create `loading.tsx` and `error.tsx` per route segment

---

## See Also

- **[04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md)** — Use cases and ports
- **[06-VALIDATION](./06-VALIDATION.md)** — Edge validation with Zod
- **[07-I18N](./07-I18N.md)** — Locale resolution and error message translation
