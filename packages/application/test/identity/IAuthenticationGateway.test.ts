import { describe, beforeEach, expect, it } from 'vitest';

import { DomainError } from '@repo/core/shared';

import { AuthCookieApi } from '~/identity/ports/AuthCookieApi';
import { AuthPrincipal } from '~/identity/dtos/AuthPrincipal';
import { FakeAuthenticationGateway } from './FakeAuthenticationGateway';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** In-memory cookie jar for tests. */
function makeCookieApi(initial: Record<string, string> = {}): AuthCookieApi & {
  store: Record<string, string>;
} {
  const store: Record<string, string> = { ...initial };
  return {
    store,
    get(name) { return store[name]; },
    set(name, value) { store[name] = value; },
    delete(name) { delete store[name]; },
  };
}

const ADMIN_PRINCIPAL: AuthPrincipal = { id: 'user-1', email: 'admin@example.com', role: 'ADMIN' };
const VISITOR_PRINCIPAL: AuthPrincipal = { id: 'user-2', email: 'visitor@example.com', role: 'VISITOR' };

const SEED_USERS = {
  'admin@example.com': { password: 'secret-admin', principal: ADMIN_PRINCIPAL },
  'visitor@example.com': { password: 'secret-visitor', principal: VISITOR_PRINCIPAL },
};

// ---------------------------------------------------------------------------
// signInWithPassword
// ---------------------------------------------------------------------------

describe('IAuthenticationGateway — signInWithPassword', () => {
  let gateway: FakeAuthenticationGateway;

  beforeEach(() => {
    gateway = new FakeAuthenticationGateway(SEED_USERS);
  });

  it('should return Right(AuthSession) when credentials are valid', async () => {
    const result = await gateway.signInWithPassword({
      email: 'admin@example.com',
      password: 'secret-admin',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      accessToken: expect.stringContaining('access:'),
      refreshToken: expect.stringContaining('refresh:'),
      expiresAt: expect.any(Number),
    });
  });

  it('should return Left(DomainError) when email does not exist', async () => {
    const result = await gateway.signInWithPassword({
      email: 'unknown@example.com',
      password: 'any',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DomainError);
    expect((result.value as DomainError).code).toBe('INVALID_CREDENTIALS');
  });

  it('should return Left(DomainError) when password is wrong', async () => {
    const result = await gateway.signInWithPassword({
      email: 'admin@example.com',
      password: 'wrong-password',
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_CREDENTIALS');
  });

  it('should return Left(DomainError) when a forced error is set', async () => {
    const error = new DomainError('IDP_UNAVAILABLE', { message: 'Service is down.' });
    gateway.simulateError(error);

    const result = await gateway.signInWithPassword({
      email: 'admin@example.com',
      password: 'secret-admin',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(error);
  });
});

// ---------------------------------------------------------------------------
// signOut
// ---------------------------------------------------------------------------

describe('IAuthenticationGateway — signOut', () => {
  let gateway: FakeAuthenticationGateway;

  beforeEach(() => {
    gateway = new FakeAuthenticationGateway(SEED_USERS);
  });

  it('should return Right(void) when called with valid tokens', async () => {
    const result = await gateway.signOut(
      'access:admin@example.com:abc',
      'refresh:admin@example.com:abc',
    );

    expect(result.isRight()).toBe(true);
  });

  it('should return Right(void) when called with empty tokens', async () => {
    const result = await gateway.signOut('', '');

    expect(result.isRight()).toBe(true);
  });

  it('should return Left(DomainError) when a forced error is set', async () => {
    const error = new DomainError('IDP_UNAVAILABLE', { message: 'Service is down.' });
    gateway.simulateError(error);

    const result = await gateway.signOut('access-token', 'refresh-token');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(error);
  });
});

// ---------------------------------------------------------------------------
// refreshSession
// ---------------------------------------------------------------------------

describe('IAuthenticationGateway — refreshSession', () => {
  let gateway: FakeAuthenticationGateway;

  beforeEach(() => {
    gateway = new FakeAuthenticationGateway(SEED_USERS);
  });

  it('should return Right(AuthSession) with a new session when refresh token is valid', async () => {
    const result = await gateway.refreshSession('refresh:admin@example.com:abc');

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      accessToken: expect.stringContaining('access:admin@example.com:'),
      refreshToken: expect.stringContaining('refresh:admin@example.com:'),
      expiresAt: expect.any(Number),
    });
  });

  it('should return Left(DomainError) when refresh token is empty', async () => {
    const result = await gateway.refreshSession('');

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('NO_REFRESH_TOKEN');
  });

  it('should return Left(DomainError) when refresh token is malformed', async () => {
    const result = await gateway.refreshSession('malformed-token');

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_REFRESH_TOKEN');
  });

  it('should return Left(DomainError) when refresh token references unknown user', async () => {
    const result = await gateway.refreshSession('refresh:ghost@example.com:abc');

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_REFRESH_TOKEN');
  });

  it('should return Left(DomainError) when a forced error is set', async () => {
    const error = new DomainError('IDP_UNAVAILABLE', { message: 'Service is down.' });
    gateway.simulateError(error);

    const result = await gateway.refreshSession('refresh:admin@example.com:abc');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(error);
  });
});

// ---------------------------------------------------------------------------
// getPrincipalFromCookies
// ---------------------------------------------------------------------------

describe('IAuthenticationGateway — getPrincipalFromCookies', () => {
  let gateway: FakeAuthenticationGateway;

  beforeEach(() => {
    gateway = new FakeAuthenticationGateway(SEED_USERS);
  });

  it('should return Right(AuthPrincipal) when a valid access token is in cookies', async () => {
    const cookies = makeCookieApi({
      'sb-access-token': 'access:admin@example.com:xyz',
    });

    const result = await gateway.getPrincipalFromCookies(cookies);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(ADMIN_PRINCIPAL);
  });

  it('should return the correct principal for each user', async () => {
    const cookies = makeCookieApi({
      'sb-access-token': 'access:visitor@example.com:xyz',
    });

    const result = await gateway.getPrincipalFromCookies(cookies);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(VISITOR_PRINCIPAL);
  });

  it('should return Left(DomainError) when no access token cookie is present', async () => {
    const cookies = makeCookieApi();

    const result = await gateway.getPrincipalFromCookies(cookies);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('NO_ACCESS_TOKEN');
  });

  it('should return Left(DomainError) when access token is malformed', async () => {
    const cookies = makeCookieApi({ 'sb-access-token': 'malformed-token' });

    const result = await gateway.getPrincipalFromCookies(cookies);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_ACCESS_TOKEN');
  });

  it('should return Left(DomainError) when access token references unknown user', async () => {
    const cookies = makeCookieApi({ 'sb-access-token': 'access:ghost@example.com:xyz' });

    const result = await gateway.getPrincipalFromCookies(cookies);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_ACCESS_TOKEN');
  });

  it('should return Left(DomainError) when a forced error is set', async () => {
    const error = new DomainError('IDP_UNAVAILABLE', { message: 'Service is down.' });
    gateway.simulateError(error);

    const result = await gateway.getPrincipalFromCookies(makeCookieApi());

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(error);
  });
});

// ---------------------------------------------------------------------------
// getPrincipalFromSession
// ---------------------------------------------------------------------------

describe('IAuthenticationGateway — getPrincipalFromSession', () => {
  let gateway: FakeAuthenticationGateway;

  beforeEach(() => {
    gateway = new FakeAuthenticationGateway(SEED_USERS);
  });

  it('should return Right(AuthPrincipal) when session access token is valid', async () => {
    const session = {
      accessToken: 'access:admin@example.com:xyz',
      refreshToken: 'refresh:admin@example.com:xyz',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };

    const result = await gateway.getPrincipalFromSession(session);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(ADMIN_PRINCIPAL);
  });

  it('should return the correct principal for each user', async () => {
    const session = {
      accessToken: 'access:visitor@example.com:xyz',
      refreshToken: 'refresh:visitor@example.com:xyz',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };

    const result = await gateway.getPrincipalFromSession(session);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(VISITOR_PRINCIPAL);
  });

  it('should return Left(DomainError) when access token is malformed', async () => {
    const session = {
      accessToken: 'malformed-token',
      refreshToken: 'refresh:admin@example.com:xyz',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };

    const result = await gateway.getPrincipalFromSession(session);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_ACCESS_TOKEN');
  });

  it('should return Left(DomainError) when access token references unknown user', async () => {
    const session = {
      accessToken: 'access:ghost@example.com:xyz',
      refreshToken: 'refresh:ghost@example.com:xyz',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };

    const result = await gateway.getPrincipalFromSession(session);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_ACCESS_TOKEN');
  });

  it('should return Left(DomainError) when a forced error is set', async () => {
    const error = new DomainError('IDP_UNAVAILABLE', { message: 'Service is down.' });
    gateway.simulateError(error);

    const session = {
      accessToken: 'access:admin@example.com:xyz',
      refreshToken: 'refresh:admin@example.com:xyz',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };

    const result = await gateway.getPrincipalFromSession(session);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(error);
  });
});
