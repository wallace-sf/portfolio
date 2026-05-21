# Manual Endpoint Testing Results

Branch tested: `588-test-manually-validate-all-apiv1-route-handlers`
Date: 2026-05-21
PR: #608

## Response envelope (verified on all requests)

- ✅ Success: `{ data: <T>, error: null }`
- ✅ Failure: `{ data: null, error: { code, message } }`

---

## Portfolio — Public ✅

| Endpoint | HTTP | Result |
|---|---|---|
| `GET /api/v1/projects` | 200 | list of published projects |
| `GET /api/v1/projects/featured` | 200 | featured projects |
| `GET /api/v1/projects/:slug` (valid) | 200 | project by slug |
| `GET /api/v1/projects/:slug` (unknown) | 404 | `NOT_FOUND` |
| `GET /api/v1/experiences` | 200 | list of experiences |
| `GET /api/v1/profile` | 200 | profile data |

i18n: `Accept-Language: pt-BR` and `en-US` both return correctly localized content ✅

---

## Contact ✅

| Scenario | HTTP | `error.code` |
|---|---|---|
| Valid body `{ name, email, message }` | 201 | — |
| Missing / invalid field | 400 | `INVALID_NAME` |
| Malformed JSON | 400 | `INVALID_INPUT` |
| Rate limit (4th+ request in 1h window) | 429 | `RATE_LIMIT_EXCEEDED` |

Headers verified: `retry-after`, `x-ratelimit-limit: 3`, `x-ratelimit-remaining: 0`, `x-ratelimit-reset` ✅

---

## Auth ✅

| Scenario | HTTP | Result |
|---|---|---|
| `POST /auth/sign-in` — valid credentials | 200 | session cookie set |
| `POST /auth/sign-in` — invalid credentials | 401 | `AUTH_INVALID_CREDENTIALS` |
| `POST /auth/sign-in` — malformed body | 400 | `INVALID_INPUT` |
| `POST /auth/sign-out` — with active session | 200 | cookie cleared |
| `POST /auth/refresh` — valid session | 200 | cookie renewed |

---

## Identity ✅

| Scenario | HTTP | Result |
|---|---|---|
| `GET /me` — authenticated | 200 | `{ email, role: "ADMIN" }` |
| `GET /me` — no session | 401 | `AUTH_REQUIRED` |

---

## Admin ✅

| Endpoint | No session | With admin session |
|---|---|---|
| `POST /admin/projects` | 401 `AUTH_REQUIRED` | 201 created |
| `PUT /admin/projects/:id` | — | 200 updated |
| `POST /admin/projects/:id/publish` | — | 200 `DRAFT → PUBLISHED` |
| `POST /admin/projects/:id/archive` | — | 200 `PUBLISHED → ARCHIVED` |
| `DELETE /admin/projects/:id` | — | 204 |
| `PUT /admin/profile` | 401 `AUTH_REQUIRED` | 200 updated |
| `POST /admin/experiences` | 401 `AUTH_REQUIRED` | 201 created |
| `PUT /admin/experiences/:id` | 401 `AUTH_REQUIRED` | 200 updated |
| `DELETE /admin/experiences/:id` | 401 `AUTH_REQUIRED` | 204 |

---

## Discrepancies between issue #588 and current implementation

| Issue #588 | Actual implementation | Action |
|---|---|---|
| `GET /admin/projects` | **Does not exist** — route only has `POST` | Follow-up issue created |
| `GET /admin/profile` | **Does not exist** — route only has `PUT` | Follow-up issue created |
| `PATCH /admin/projects/:slug` | **`PUT /admin/projects/:id`** — uses ID, not slug | Documented |
| `PATCH /admin/profile` | **`PUT /admin/profile`** | Documented |
| `PATCH /admin/experiences/:id` | **`PUT /admin/experiences/:id`** | Documented |
| Non-admin → 401 `UNAUTHORIZED` | Not testable — no non-admin test user available | Documented |

---

## Bug found 🐛

`POST /admin/projects` with a duplicate slug returns **500 INTERNAL_ERROR** instead of 400.
The database uniqueness constraint should be caught as a `ValidationError` in the infra layer.
Follow-up: issue #609

---

## Follow-up issues created

| Issue | Description |
|---|---|
| #603 | refactor(auth): extract sign-in orchestration into SignIn use case |
| #604 | refactor(auth): consolidate cookie management in refreshSession gateway method |
| #609 | bug: POST /admin/projects with duplicate slug returns 500 instead of 400 |
