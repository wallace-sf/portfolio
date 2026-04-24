export type CookieSetOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  /** Max-age in seconds. */
  maxAge?: number;
  path?: string;
};

/**
 * Framework-agnostic cookie accessor.
 *
 * The application layer depends on this interface; the infrastructure layer
 * (e.g. Next.js route handlers) provides the concrete implementation.
 * This keeps `@repo/application` free of any `next/headers` import.
 */
export type AuthCookieApi = {
  get(name: string): string | undefined;
  set(name: string, value: string, options?: CookieSetOptions): void;
  delete(name: string): void;
};
