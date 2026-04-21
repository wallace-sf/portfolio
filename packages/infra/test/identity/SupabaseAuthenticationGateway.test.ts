import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DomainError } from '@repo/core/shared';

import {
  SUPABASE_ACCESS_TOKEN_COOKIE,
  SUPABASE_REFRESH_TOKEN_COOKIE,
  SupabaseAuthenticationGateway,
} from '../../src/identity/SupabaseAuthenticationGateway';
import { AuthCookieApi } from '@repo/application/identity';

// ---------------------------------------------------------------------------
// Module mock
// ---------------------------------------------------------------------------

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }));

import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeGateway() {
  return new SupabaseAuthenticationGateway(
    'https://test.supabase.co',
    'test-anon-key',
  );
}

function makeCookieApi(initial: Record<string, string> = {}): AuthCookieApi & {
  store: Record<string, string>;
} {
  const store: Record<string, string> = { ...initial };
  return {
    store,
    get: (name) => store[name],
    set: (name, value) => { store[name] = value; },
    delete: (name) => { delete store[name]; },
  };
}

function makeAuthMock(overrides: Record<string, ReturnType<typeof vi.fn>> = {}) {
  return {
    signInWithPassword: vi.fn(),
    setSession: vi.fn(),
    signOut: vi.fn(),
    refreshSession: vi.fn(),
    getUser: vi.fn(),
    ...overrides,
  };
}

function mockClient(authOverrides: Record<string, ReturnType<typeof vi.fn>> = {}) {
  const auth = makeAuthMock(authOverrides);
  vi.mocked(createClient).mockReturnValue({ auth } as ReturnType<typeof createClient>);
  return auth;
}

const SESSION = {
  access_token: 'access-jwt',
  refresh_token: 'refresh-token',
  expires_at: 9999999999,
};

// ---------------------------------------------------------------------------
// signInWithPassword
// ---------------------------------------------------------------------------

describe('SupabaseAuthenticationGateway — signInWithPassword', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return Right(AuthSession) on valid credentials', async () => {
    mockClient({
      signInWithPassword: vi.fn().mockResolvedValue({ data: { session: SESSION }, error: null }),
    });

    const result = await makeGateway().signInWithPassword({
      email: 'admin@example.com',
      password: 'secret',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      accessToken: SESSION.access_token,
      refreshToken: SESSION.refresh_token,
      expiresAt: SESSION.expires_at,
    });
  });

  it('should return Left(DomainError INVALID_CREDENTIALS) when Supabase returns an error', async () => {
    mockClient({
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid login credentials' },
      }),
    });

    const result = await makeGateway().signInWithPassword({
      email: 'admin@example.com',
      password: 'wrong',
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_CREDENTIALS');
    expect((result.value as DomainError).message).toContain('Invalid login credentials');
  });

  it('should return Left(DomainError INVALID_CREDENTIALS) when session is null without error', async () => {
    mockClient({
      signInWithPassword: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    });

    const result = await makeGateway().signInWithPassword({
      email: 'admin@example.com',
      password: 'secret',
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_CREDENTIALS');
  });

  it('should return Left(DomainError AUTH_UNEXPECTED_ERROR) when createClient throws', async () => {
    vi.mocked(createClient).mockImplementation(() => { throw new Error('Network failure'); });

    const result = await makeGateway().signInWithPassword({
      email: 'admin@example.com',
      password: 'secret',
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('AUTH_UNEXPECTED_ERROR');
    expect((result.value as DomainError).message).toContain('Network failure');
  });
});

// ---------------------------------------------------------------------------
// signOut
// ---------------------------------------------------------------------------

describe('SupabaseAuthenticationGateway — signOut', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return Right(void) and delete cookies when tokens are present', async () => {
    mockClient({
      setSession: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    });
    const cookies = makeCookieApi({
      [SUPABASE_ACCESS_TOKEN_COOKIE]: 'access-jwt',
      [SUPABASE_REFRESH_TOKEN_COOKIE]: 'refresh-token',
    });

    const result = await makeGateway().signOut(cookies);

    expect(result.isRight()).toBe(true);
    expect(cookies.store[SUPABASE_ACCESS_TOKEN_COOKIE]).toBeUndefined();
    expect(cookies.store[SUPABASE_REFRESH_TOKEN_COOKIE]).toBeUndefined();
  });

  it('should return Right(void) even when cookies are already absent', async () => {
    mockClient();

    const result = await makeGateway().signOut(makeCookieApi());

    expect(result.isRight()).toBe(true);
  });

  it('should return Left(DomainError AUTH_UNEXPECTED_ERROR) when signOut throws', async () => {
    mockClient({
      setSession: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockRejectedValue(new Error('Supabase unreachable')),
    });
    const cookies = makeCookieApi({
      [SUPABASE_ACCESS_TOKEN_COOKIE]: 'access-jwt',
      [SUPABASE_REFRESH_TOKEN_COOKIE]: 'refresh-token',
    });

    const result = await makeGateway().signOut(cookies);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('AUTH_UNEXPECTED_ERROR');
  });
});

// ---------------------------------------------------------------------------
// refreshSession
// ---------------------------------------------------------------------------

describe('SupabaseAuthenticationGateway — refreshSession', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return Right(AuthSession) with new tokens', async () => {
    const newSession = { ...SESSION, access_token: 'new-access', refresh_token: 'new-refresh' };
    mockClient({
      refreshSession: vi.fn().mockResolvedValue({ data: { session: newSession }, error: null }),
    });
    const cookies = makeCookieApi({ [SUPABASE_REFRESH_TOKEN_COOKIE]: 'old-refresh' });

    const result = await makeGateway().refreshSession(cookies);

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
  });

  it('should return Left(DomainError NO_REFRESH_TOKEN) when cookie is absent', async () => {
    mockClient();

    const result = await makeGateway().refreshSession(makeCookieApi());

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('NO_REFRESH_TOKEN');
  });

  it('should return Left(DomainError INVALID_REFRESH_TOKEN) when Supabase returns an error', async () => {
    mockClient({
      refreshSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: { message: 'Refresh token already used' },
      }),
    });
    const cookies = makeCookieApi({ [SUPABASE_REFRESH_TOKEN_COOKIE]: 'stale-token' });

    const result = await makeGateway().refreshSession(cookies);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_REFRESH_TOKEN');
    expect((result.value as DomainError).message).toContain('Refresh token already used');
  });

  it('should return Left(DomainError AUTH_UNEXPECTED_ERROR) when refreshSession throws', async () => {
    mockClient({
      refreshSession: vi.fn().mockRejectedValue(new Error('Network timeout')),
    });
    const cookies = makeCookieApi({ [SUPABASE_REFRESH_TOKEN_COOKIE]: 'some-token' });

    const result = await makeGateway().refreshSession(cookies);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('AUTH_UNEXPECTED_ERROR');
  });
});

// ---------------------------------------------------------------------------
// getPrincipalFromCookies
// ---------------------------------------------------------------------------

describe('SupabaseAuthenticationGateway — getPrincipalFromCookies', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return Right(AuthPrincipal) with user data', async () => {
    mockClient({
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'user-uuid',
            email: 'admin@example.com',
            app_metadata: { role: 'ADMIN' },
          },
        },
        error: null,
      }),
    });
    const cookies = makeCookieApi({ [SUPABASE_ACCESS_TOKEN_COOKIE]: 'access-jwt' });

    const result = await makeGateway().getPrincipalFromCookies(cookies);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      id: 'user-uuid',
      email: 'admin@example.com',
      role: 'ADMIN',
    });
  });

  it('should default role to VISITOR when app_metadata has no role', async () => {
    mockClient({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-uuid', email: 'visitor@example.com', app_metadata: {} } },
        error: null,
      }),
    });
    const cookies = makeCookieApi({ [SUPABASE_ACCESS_TOKEN_COOKIE]: 'access-jwt' });

    const result = await makeGateway().getPrincipalFromCookies(cookies);

    expect(result.isRight()).toBe(true);
    expect((result.value as { role: string }).role).toBe('VISITOR');
  });

  it('should return Left(DomainError NO_ACCESS_TOKEN) when cookie is absent', async () => {
    mockClient();

    const result = await makeGateway().getPrincipalFromCookies(makeCookieApi());

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('NO_ACCESS_TOKEN');
  });

  it('should return Left(DomainError INVALID_ACCESS_TOKEN) when Supabase returns an error', async () => {
    mockClient({
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'JWT expired' },
      }),
    });
    const cookies = makeCookieApi({ [SUPABASE_ACCESS_TOKEN_COOKIE]: 'expired-jwt' });

    const result = await makeGateway().getPrincipalFromCookies(cookies);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_ACCESS_TOKEN');
    expect((result.value as DomainError).message).toContain('JWT expired');
  });

  it('should return Left(DomainError AUTH_UNEXPECTED_ERROR) when getUser throws', async () => {
    mockClient({
      getUser: vi.fn().mockRejectedValue(new Error('Connection refused')),
    });
    const cookies = makeCookieApi({ [SUPABASE_ACCESS_TOKEN_COOKIE]: 'access-jwt' });

    const result = await makeGateway().getPrincipalFromCookies(cookies);

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('AUTH_UNEXPECTED_ERROR');
  });
});
