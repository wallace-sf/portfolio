/**
 * Single source of truth for `NEXT_PUBLIC_*` environment variables read by
 * apps/blog. Each key is a lazy getter so values are read from
 * `process.env` on access rather than frozen at module load.
 */
export const env = {
  /** Canonical public origin (same domain as apps/site — /blog is served via multi-zone rewrite). Falls back to this app's own local dev server outside production. */
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002';
  },
} as const;
