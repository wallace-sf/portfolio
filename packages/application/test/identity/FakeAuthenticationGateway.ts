import { DomainError, Either, left, right } from '@repo/core/shared';

import { AuthCookieApi } from '~/identity/ports/AuthCookieApi';
import { IAuthenticationGateway, SignInWithPasswordInput } from '~/identity/ports/IAuthenticationGateway';
import { AuthPrincipal } from '~/identity/dtos/AuthPrincipal';
import { AuthSession } from '~/identity/dtos/AuthSession';

const ACCESS_TOKEN_COOKIE = 'sb-access-token';
const REFRESH_TOKEN_COOKIE = 'sb-refresh-token';

type StoredUser = { password: string; principal: AuthPrincipal };

/**
 * In-memory test double for IAuthenticationGateway.
 *
 * Seed credentials via the constructor; optionally inject errors to simulate
 * IdP failures. Tokens are plain strings of the form `<type>:<email>:<nonce>`.
 */
export class FakeAuthenticationGateway implements IAuthenticationGateway {
  private readonly users: Map<string, StoredUser>;
  /** If set, every call returns this error. */
  private forcedError: DomainError | null = null;

  constructor(users: Record<string, { password: string; principal: AuthPrincipal }> = {}) {
    this.users = new Map(Object.entries(users));
  }

  /** Force all subsequent calls to return a Left with this error. */
  simulateError(error: DomainError): void {
    this.forcedError = error;
  }

  /** Remove the forced error so calls behave normally again. */
  clearError(): void {
    this.forcedError = null;
  }

  async signInWithPassword(
    credentials: SignInWithPasswordInput,
  ): Promise<Either<DomainError, AuthSession>> {
    if (this.forcedError) return left(this.forcedError);

    const stored = this.users.get(credentials.email);
    if (!stored || stored.password !== credentials.password) {
      return left(new DomainError('INVALID_CREDENTIALS', { message: 'Invalid email or password.' }));
    }

    return right(this._makeSession(credentials.email));
  }

  async signOut(cookies: AuthCookieApi): Promise<Either<DomainError, void>> {
    if (this.forcedError) return left(this.forcedError);

    cookies.delete(ACCESS_TOKEN_COOKIE);
    cookies.delete(REFRESH_TOKEN_COOKIE);
    return right(undefined);
  }

  async refreshSession(cookies: AuthCookieApi): Promise<Either<DomainError, AuthSession>> {
    if (this.forcedError) return left(this.forcedError);

    const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE);
    if (!refreshToken) {
      return left(new DomainError('NO_REFRESH_TOKEN', { message: 'No refresh token in cookies.' }));
    }

    const email = this._emailFromToken(refreshToken);
    if (!email || !this.users.has(email)) {
      return left(new DomainError('INVALID_REFRESH_TOKEN', { message: 'Refresh token is invalid or expired.' }));
    }

    return right(this._makeSession(email));
  }

  async getPrincipalFromCookies(
    cookies: AuthCookieApi,
  ): Promise<Either<DomainError, AuthPrincipal>> {
    if (this.forcedError) return left(this.forcedError);

    const accessToken = cookies.get(ACCESS_TOKEN_COOKIE);
    if (!accessToken) {
      return left(new DomainError('NO_ACCESS_TOKEN', { message: 'No access token in cookies.' }));
    }

    const email = this._emailFromToken(accessToken);
    const stored = email ? this.users.get(email) : undefined;
    if (!stored) {
      return left(new DomainError('INVALID_ACCESS_TOKEN', { message: 'Access token is invalid or expired.' }));
    }

    return right(stored.principal);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private _makeSession(email: string): AuthSession {
    const nonce = Math.random().toString(36).slice(2);
    return {
      accessToken: `access:${email}:${nonce}`,
      refreshToken: `refresh:${email}:${nonce}`,
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
  }

  private _emailFromToken(token: string): string | null {
    // Token format: "<type>:<email>:<nonce>"
    const parts = token.split(':');
    return parts.length === 3 ? (parts[1] ?? null) : null;
  }
}
