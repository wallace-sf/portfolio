import { describe, expect, it } from 'vitest';

import { DomainError } from '@repo/core/shared';

import {
  SUPABASE_ACCESS_TOKEN_COOKIE,
  SUPABASE_REFRESH_TOKEN_COOKIE,
  SupabaseAuthenticationGateway,
} from '../../src/identity/SupabaseAuthenticationGateway';
import { AuthCookieApi } from '@repo/application/identity';

// ---------------------------------------------------------------------------
// Environment guard
// ---------------------------------------------------------------------------

const SUPABASE_TEST_URL = process.env['SUPABASE_TEST_URL'];
const SUPABASE_TEST_ANON_KEY = process.env['SUPABASE_TEST_ANON_KEY'];
const SUPABASE_TEST_EMAIL = process.env['SUPABASE_TEST_EMAIL'];
const SUPABASE_TEST_PASSWORD = process.env['SUPABASE_TEST_PASSWORD'];

const missingEnv =
  !SUPABASE_TEST_URL ||
  !SUPABASE_TEST_ANON_KEY ||
  !SUPABASE_TEST_EMAIL ||
  !SUPABASE_TEST_PASSWORD;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeGateway() {
  return new SupabaseAuthenticationGateway(
    SUPABASE_TEST_URL!,
    SUPABASE_TEST_ANON_KEY!,
  );
}

function makeCookieApi(initial: Record<string, string> = {}): AuthCookieApi & {
  store: Record<string, string>;
} {
  const store: Record<string, string> = { ...initial };
  return {
    store,
    get: (name) => store[name],
    set: (name, value) => {
      store[name] = value;
    },
    delete: (name) => {
      delete store[name];
    },
  };
}

// ---------------------------------------------------------------------------
// Integration tests
// ---------------------------------------------------------------------------

describe.skipIf(missingEnv)(
  'SupabaseAuthenticationGateway — integration (real Supabase)',
  () => {
    // -----------------------------------------------------------------------
    // signInWithPassword
    // -----------------------------------------------------------------------

    describe('signInWithPassword', () => {
      it('should return Right(AuthSession) with valid credentials', async () => {
        const gateway = makeGateway();

        const result = await gateway.signInWithPassword({
          email: SUPABASE_TEST_EMAIL!,
          password: SUPABASE_TEST_PASSWORD!,
        });

        expect(result.isRight()).toBe(true);
        const session = result.value as {
          accessToken: string;
          refreshToken: string;
          expiresAt: number;
        };
        expect(typeof session.accessToken).toBe('string');
        expect(session.accessToken.length).toBeGreaterThan(0);
        expect(typeof session.refreshToken).toBe('string');
        expect(session.refreshToken.length).toBeGreaterThan(0);
        expect(typeof session.expiresAt).toBe('number');
        expect(session.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
      });

      it('should return Left(INVALID_CREDENTIALS) with wrong password', async () => {
        const gateway = makeGateway();

        const result = await gateway.signInWithPassword({
          email: SUPABASE_TEST_EMAIL!,
          password: 'definitely-wrong-password-xyz',
        });

        expect(result.isLeft()).toBe(true);
        expect((result.value as DomainError).code).toBe('INVALID_CREDENTIALS');
      });

      it('should return Left(INVALID_CREDENTIALS) with non-existent email', async () => {
        const gateway = makeGateway();

        const result = await gateway.signInWithPassword({
          email: 'nonexistent-user-xyz@example.invalid',
          password: 'any-password',
        });

        expect(result.isLeft()).toBe(true);
        expect((result.value as DomainError).code).toBe('INVALID_CREDENTIALS');
      });
    });

    // -----------------------------------------------------------------------
    // signOut
    // -----------------------------------------------------------------------

    describe('signOut', () => {
      it('should return Right(void) and remove cookies when tokens are present', async () => {
        const gateway = makeGateway();

        const signInResult = await gateway.signInWithPassword({
          email: SUPABASE_TEST_EMAIL!,
          password: SUPABASE_TEST_PASSWORD!,
        });
        expect(signInResult.isRight()).toBe(true);

        const { accessToken, refreshToken } = signInResult.value as {
          accessToken: string;
          refreshToken: string;
        };

        const cookies = makeCookieApi({
          [SUPABASE_ACCESS_TOKEN_COOKIE]: accessToken,
          [SUPABASE_REFRESH_TOKEN_COOKIE]: refreshToken,
        });

        const result = await gateway.signOut(cookies);

        expect(result.isRight()).toBe(true);
        expect(cookies.store[SUPABASE_ACCESS_TOKEN_COOKIE]).toBeUndefined();
        expect(cookies.store[SUPABASE_REFRESH_TOKEN_COOKIE]).toBeUndefined();
      });

      it('should return Right(void) even when cookies are absent (no-op)', async () => {
        const gateway = makeGateway();

        const result = await gateway.signOut(makeCookieApi());

        expect(result.isRight()).toBe(true);
      });
    });

    // -----------------------------------------------------------------------
    // refreshSession
    // -----------------------------------------------------------------------

    describe('refreshSession', () => {
      it('should return Right(AuthSession) with new tokens when refresh token is valid', async () => {
        const gateway = makeGateway();

        const signInResult = await gateway.signInWithPassword({
          email: SUPABASE_TEST_EMAIL!,
          password: SUPABASE_TEST_PASSWORD!,
        });
        expect(signInResult.isRight()).toBe(true);

        const { refreshToken } = signInResult.value as { refreshToken: string };
        const cookies = makeCookieApi({
          [SUPABASE_REFRESH_TOKEN_COOKIE]: refreshToken,
        });

        const result = await gateway.refreshSession(cookies);

        expect(result.isRight()).toBe(true);
        const newSession = result.value as {
          accessToken: string;
          refreshToken: string;
        };
        expect(typeof newSession.accessToken).toBe('string');
        expect(newSession.accessToken.length).toBeGreaterThan(0);
      });

      it('should return Left(NO_REFRESH_TOKEN) when cookie is absent', async () => {
        const gateway = makeGateway();

        const result = await gateway.refreshSession(makeCookieApi());

        expect(result.isLeft()).toBe(true);
        expect((result.value as DomainError).code).toBe('NO_REFRESH_TOKEN');
      });

      it('should return Left(INVALID_REFRESH_TOKEN) when token is bogus', async () => {
        const gateway = makeGateway();
        const cookies = makeCookieApi({
          [SUPABASE_REFRESH_TOKEN_COOKIE]: 'totally-invalid-refresh-token',
        });

        const result = await gateway.refreshSession(cookies);

        expect(result.isLeft()).toBe(true);
        expect((result.value as DomainError).code).toBe('INVALID_REFRESH_TOKEN');
      });
    });

    // -----------------------------------------------------------------------
    // getPrincipalFromCookies
    // -----------------------------------------------------------------------

    describe('getPrincipalFromCookies', () => {
      it('should return Right(AuthPrincipal) with a valid access token', async () => {
        const gateway = makeGateway();

        const signInResult = await gateway.signInWithPassword({
          email: SUPABASE_TEST_EMAIL!,
          password: SUPABASE_TEST_PASSWORD!,
        });
        expect(signInResult.isRight()).toBe(true);

        const { accessToken } = signInResult.value as { accessToken: string };
        const cookies = makeCookieApi({
          [SUPABASE_ACCESS_TOKEN_COOKIE]: accessToken,
        });

        const result = await gateway.getPrincipalFromCookies(cookies);

        expect(result.isRight()).toBe(true);
        const principal = result.value as {
          id: string;
          email: string;
          role: string;
        };
        expect(typeof principal.id).toBe('string');
        expect(principal.id.length).toBeGreaterThan(0);
        expect(principal.email).toBe(SUPABASE_TEST_EMAIL);
        expect(typeof principal.role).toBe('string');
      });

      it('should return Left(NO_ACCESS_TOKEN) when cookie is absent', async () => {
        const gateway = makeGateway();

        const result = await gateway.getPrincipalFromCookies(makeCookieApi());

        expect(result.isLeft()).toBe(true);
        expect((result.value as DomainError).code).toBe('NO_ACCESS_TOKEN');
      });

      it('should return Left(INVALID_ACCESS_TOKEN) when token is bogus', async () => {
        const gateway = makeGateway();
        const cookies = makeCookieApi({
          [SUPABASE_ACCESS_TOKEN_COOKIE]: 'not-a-real-jwt',
        });

        const result = await gateway.getPrincipalFromCookies(cookies);

        expect(result.isLeft()).toBe(true);
        expect((result.value as DomainError).code).toBe('INVALID_ACCESS_TOKEN');
      });
    });
  },
);
