# Bruno base (via OpenAPI YAML)

This folder keeps a minimal Bruno collection setup, while endpoint contracts live in YAML so they remain tool-agnostic.

## Files

- `../openapi/portfolio-api.v1.yml`: source of truth for API requests/responses.
- `./bruno.json`: base Bruno collection metadata.

## How to use with Bruno

1. Open Bruno and choose `Import Collection`.
2. Select `tests/api/openapi/portfolio-api.v1.yml`.
3. Set the environment variable `baseUrl` to `http://localhost:3000` (or your target URL).
4. Run requests and optionally save generated `.bru` files in this folder.

## Why YAML first

OpenAPI YAML can be consumed by Bruno, Postman, Insomnia, Swagger UI, and CI tooling, avoiding lock-in to a single client.
