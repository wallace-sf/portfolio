import type {
  AuthCookieApi,
  AuthSession,
  CookieSetOptions,
} from '@repo/application/identity';
import {
  SUPABASE_ACCESS_TOKEN_COOKIE,
  SUPABASE_REFRESH_TOKEN_COOKIE,
} from '@repo/infra';
import { cookies } from 'next/headers';

export async function createNextAuthCookieApi(): Promise<AuthCookieApi> {
  const jar = await cookies();
  return {
    get(name: string): string | undefined {
      return jar.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieSetOptions): void {
      jar.set(name, value, options ?? {});
    },
    delete(name: string): void {
      jar.delete(name);
    },
  };
}

export function setSessionCookies(
  cookieApi: AuthCookieApi,
  session: AuthSession,
): void {
  const expiresIn = session.expiresAt - Math.floor(Date.now() / 1000);
  cookieApi.set(SUPABASE_ACCESS_TOKEN_COOKIE, session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiresIn,
    path: '/',
  });
  cookieApi.set(SUPABASE_REFRESH_TOKEN_COOKIE, session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}

export function clearSessionCookies(cookieApi: AuthCookieApi): void {
  cookieApi.delete(SUPABASE_ACCESS_TOKEN_COOKIE);
  cookieApi.delete(SUPABASE_REFRESH_TOKEN_COOKIE);
}
