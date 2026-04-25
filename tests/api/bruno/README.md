# Bruno collections

Versioned Bruno collections live in subfolders.

## Available versions

- `./v1`: current API v1 collection (`web-api`).

## How to use with Bruno Free

1. Open Bruno and choose `Open Collection`.
2. Select `tests/api/bruno/v1`.
3. In Bruno, select the `local` environment.
4. Update `authEmail`, `authPassword`, and `projectSlug` in `v1/environments/local.bru` if needed.

## Notes

- The OpenAPI contract remains tool-agnostic at `../openapi/v1/web-api.yml`.
- Cookie-based auth is handled by Bruno's cookie jar after `auth/post-sign-in`.
