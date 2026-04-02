# 05 — API Contracts

> Response envelope, error handling, HTTP status mapping, authorization, and the REST surface (`/api/v1`).

---

## REST as the only presentation boundary

- **`apps/web` must not** import `@repo/application` or call use cases from pages, layouts, or client components.
- **Route handlers** (Next.js Route Handlers under `apps/web/app/api/...`, or a future `apps/api` app) are the **composition root**: they wire `@repo/infra`, invoke use cases, and return JSON.
- This keeps a single HTTP contract for browsers, SSR, and external clients.

See [02-ARCHITECTURE](./02-ARCHITECTURE.md) and [04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md).

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

| Domain / application error | HTTP status |
|----------------------------|-------------|
| `ValidationError` / invalid input | 400 |
| `NotFoundError` | 404 |
| `UnauthorizedError` (e.g. `EnsureAdmin` when user is not admin) | 401 |
| Unexpected / infrastructure | 500 |

Use **403** only when you introduce a distinct “authenticated but forbidden for this resource” rule; today `UnauthorizedError` maps to **401** for failed privilege checks.

---

## Error Codes

The domain uses **stable error codes** (e.g. `INVALID_SLUG`, `UNAUTHORIZED`). The edge maps them to HTTP status and resolves a localized message.

Examples:

| Code | HTTP | Meaning |
|------|------|---------|
| `ERROR_INVALID_ID` | 400 | UUID format violated |
| `ERROR_INVALID_TEXT` | 400 | Text length constraint violated |
| `INVALID_SLUG` | 400 | Slug format violated |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Not allowed (e.g. not admin) |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Error Handling at the Edge

```typescript
try {
  const result = await getProjectBySlug(slug);
  if (result.isLeft()) {
    const { code } = result.value;
    const status =
      code === 'NOT_FOUND' ? 404 : code === 'UNAUTHORIZED' ? 401 : 400;
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

## Authorization model (overview)

| Audience | Typical use |
|----------|-------------|
| **Anonymous** | Public read endpoints (portfolio content), `POST /contact` |
| **Authenticated** | `GET /me` — requires a valid session; resolves `userId` for `GetCurrentUser` |
| **Admin** | Mutations and admin-only reads — handler runs `EnsureAdmin` with the current `userId` before proceeding |

Exact session mechanics (Supabase Auth, cookies, headers) live in **infra** and **middleware**; the API contract assumes the handler can obtain a stable `userId` for logged-in requests.

---

## REST surface (`/api/v1`)

Paths below are the **contract**. Handlers may be implemented incrementally; behavior must match use cases in [04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md).

### Portfolio (read, public)

| Method | Path | Use case | Auth |
|--------|------|----------|------|
| `GET` | `/api/v1/projects` | `GetPublishedProjects` | Public |
| `GET` | `/api/v1/projects/featured` | `GetFeaturedProjects` | Public |
| `GET` | `/api/v1/projects/:slug` | `GetProjectBySlug` | Public |
| `GET` | `/api/v1/experiences` | `GetExperiences` | Public |
| `GET` | `/api/v1/profile` | `GetProfile` | Public |

Query parameters such as `locale` should align with `@repo/core` `Locale` and existing i18n conventions.

### Contact

| Method | Path | Use case | Auth |
|--------|------|----------|------|
| `POST` | `/api/v1/contact` | `SendContactMessage` | Public (consider rate limit / CAPTCHA at the edge) |

### Identity

| Method | Path | Use case | Auth |
|--------|------|----------|------|
| `GET` | `/api/v1/me` | `GetCurrentUser` | **Session required** — without a resolvable `userId`, respond with **401** |

Admin-only routes (e.g. future `PATCH /api/v1/projects/:slug`) must call `EnsureAdmin.execute({ userId })` before applying changes; failure → **401** with `UNAUTHORIZED`.

---

## Blog _(post-MVP)_

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/posts` | List posts (`?tag=`, `?limit=`, `?offset=`) |
| `GET` | `/api/v1/posts/:slug` | Get post by slug |
| `GET` | `/api/v1/tags` | List tags |

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
- **[11-IDENTITY](./11-IDENTITY.md)** — Identity bounded context and UI routes
