import { DomainError, Either } from '@repo/core/shared';

import { AuthPrincipal } from '../dtos/AuthPrincipal';
import { AuthSession } from '../dtos/AuthSession';
import { AuthCookieApi } from './AuthCookieApi';

export type SignInWithPasswordInput = {
  email: string;
  password: string;
};

/**
 * Port for authentication operations.
 *
 * Implemented by the infrastructure layer (e.g. SupabaseAuthenticationGateway).
 * Must never import `@supabase/*` or `next/headers` here.
 */
export interface IAuthenticationGateway {
  /**
   * Authenticate with email and password.
   * Returns an `AuthSession` on success; the caller is responsible for
   * persisting the tokens in cookies via `AuthCookieApi`.
   */
  signInWithPassword(
    credentials: SignInWithPasswordInput,
  ): Promise<Either<DomainError, AuthSession>>;

  /**
   * Invalidate the current session at the IdP.
   * The caller is responsible for clearing cookies after this returns.
   */
  signOut(
    accessToken: string,
    refreshToken: string,
  ): Promise<Either<DomainError, void>>;

  /**
   * Exchange a refresh token for a new session.
   * Returns a new `AuthSession`; the caller is responsible for updating cookies.
   */
  refreshSession(
    refreshToken: string,
  ): Promise<Either<DomainError, AuthSession>>;

  /**
   * Decode and validate the access token stored in cookies.
   * Returns the authenticated principal without a network round-trip when
   * using locally-verifiable JWTs.
   */
  getPrincipalFromCookies(
    cookies: AuthCookieApi,
  ): Promise<Either<DomainError, AuthPrincipal>>;

  /**
   * Decode and validate the access token from an in-memory `AuthSession`.
   * Use this immediately after `signInWithPassword` to avoid constructing
   * a fake cookie reader.
   */
  getPrincipalFromSession(
    session: AuthSession,
  ): Promise<Either<DomainError, AuthPrincipal>>;
}
