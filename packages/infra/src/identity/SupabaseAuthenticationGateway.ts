import { createClient } from '@supabase/supabase-js';

import {
  AuthCookieApi,
  AuthPrincipal,
  AuthSession,
  IAuthenticationGateway,
  SignInWithPasswordInput,
} from '@repo/application/identity';
import { DomainError, Either, left, right } from '@repo/core/shared';

/** Cookie name used to persist the Supabase access token (JWT). */
export const SUPABASE_ACCESS_TOKEN_COOKIE = 'sb-access-token';
/** Cookie name used to persist the Supabase refresh token. */
export const SUPABASE_REFRESH_TOKEN_COOKIE = 'sb-refresh-token';

/**
 * Supabase implementation of IAuthenticationGateway.
 *
 * All Supabase SDK imports are confined to this file and this package.
 * The application layer sees only the IAuthenticationGateway contract.
 */
export class SupabaseAuthenticationGateway implements IAuthenticationGateway {
  constructor(
    private readonly supabaseUrl: string,
    private readonly supabaseAnonKey: string,
  ) {}

  async signInWithPassword(
    credentials: SignInWithPasswordInput,
  ): Promise<Either<DomainError, AuthSession>> {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey, {
        auth: { persistSession: false },
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !data.session) {
        return left(
          new DomainError('INVALID_CREDENTIALS', {
            message: error?.message ?? 'Sign-in failed.',
          }),
        );
      }

      return right({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      });
    } catch (err) {
      return left(this._unexpectedError(err));
    }
  }

  async signOut(cookies: AuthCookieApi): Promise<Either<DomainError, void>> {
    try {
      const accessToken = cookies.get(SUPABASE_ACCESS_TOKEN_COOKIE);
      const refreshToken = cookies.get(SUPABASE_REFRESH_TOKEN_COOKIE);

      if (accessToken && refreshToken) {
        const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey, {
          auth: { persistSession: false },
        });
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        await supabase.auth.signOut();
      }

      cookies.delete(SUPABASE_ACCESS_TOKEN_COOKIE);
      cookies.delete(SUPABASE_REFRESH_TOKEN_COOKIE);

      return right(undefined);
    } catch (err) {
      return left(this._unexpectedError(err));
    }
  }

  async refreshSession(cookies: AuthCookieApi): Promise<Either<DomainError, AuthSession>> {
    try {
      const refreshToken = cookies.get(SUPABASE_REFRESH_TOKEN_COOKIE);

      if (!refreshToken) {
        return left(
          new DomainError('NO_REFRESH_TOKEN', { message: 'No refresh token in cookies.' }),
        );
      }

      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey, {
        auth: { persistSession: false },
      });

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        return left(
          new DomainError('INVALID_REFRESH_TOKEN', {
            message: error?.message ?? 'Session refresh failed.',
          }),
        );
      }

      return right({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      });
    } catch (err) {
      return left(this._unexpectedError(err));
    }
  }

  async getPrincipalFromCookies(
    cookies: AuthCookieApi,
  ): Promise<Either<DomainError, AuthPrincipal>> {
    try {
      const accessToken = cookies.get(SUPABASE_ACCESS_TOKEN_COOKIE);

      if (!accessToken) {
        return left(
          new DomainError('NO_ACCESS_TOKEN', { message: 'No access token in cookies.' }),
        );
      }

      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey, {
        auth: { persistSession: false },
      });

      const { data, error } = await supabase.auth.getUser(accessToken);

      if (error || !data.user) {
        return left(
          new DomainError('INVALID_ACCESS_TOKEN', {
            message: error?.message ?? 'Access token is invalid or expired.',
          }),
        );
      }

      return right({
        id: data.user.id,
        email: data.user.email ?? '',
        role: (data.user.app_metadata?.['role'] as string | undefined) ?? 'VISITOR',
      });
    } catch (err) {
      return left(this._unexpectedError(err));
    }
  }

  private _unexpectedError(err: unknown): DomainError {
    const message = err instanceof Error ? err.message : 'Unexpected authentication error.';
    return new DomainError('AUTH_UNEXPECTED_ERROR', { message });
  }
}
