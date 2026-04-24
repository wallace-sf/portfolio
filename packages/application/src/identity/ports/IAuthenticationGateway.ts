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
   * Invalidate the current session.
   * Reads the access token from cookies to identify the session at the IdP.
   */
  signOut(cookies: AuthCookieApi): Promise<Either<DomainError, void>>;

  /**
   * Obtain a fresh session using the refresh token stored in cookies.
   * Returns a new `AuthSession`; the caller updates the cookies.
   */
  refreshSession(
    cookies: AuthCookieApi,
  ): Promise<Either<DomainError, AuthSession>>;

  /**
   * Decode and validate the access token stored in cookies.
   * Returns the authenticated principal without a network round-trip when
   * using locally-verifiable JWTs.
   */
  getPrincipalFromCookies(
    cookies: AuthCookieApi,
  ): Promise<Either<DomainError, AuthPrincipal>>;
}
