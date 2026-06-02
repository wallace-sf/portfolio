/**
 * @vitest-environment node
 */
import { type Container, getContainer } from '@repo/infra';

import { POST } from '~/app/api/v1/auth/sign-out/route';

vi.mock('@repo/infra', () => ({
  getContainer: vi.fn(),
  SUPABASE_ACCESS_TOKEN_COOKIE: 'sb-access-token',
  SUPABASE_REFRESH_TOKEN_COOKIE: 'sb-refresh-token',
}));

const mockCookieStore = {
  store: {} as Record<string, string>,
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

const mockSignOut = vi.fn();

beforeEach(() => {
  mockCookieStore.store = {
    'sb-access-token': 'access-token-123',
    'sb-refresh-token': 'refresh-token-456',
  };
  vi.clearAllMocks();

  mockCookieStore.get.mockImplementation((name: string) => {
    const value = mockCookieStore.store[name];
    return value !== undefined ? { name, value } : undefined;
  });
  mockCookieStore.delete.mockImplementation((name: string) => {
    delete mockCookieStore.store[name];
  });

  vi.mocked(getContainer).mockReturnValue({
    authGateway: {
      signOut: mockSignOut,
      signInWithPassword: vi.fn(),
      refreshSession: vi.fn(),
      getPrincipalFromCookies: vi.fn(),
    },
  } as unknown as Container);
});

describe('POST /api/v1/auth/sign-out', () => {
  it('should return 200 when sign-out succeeds', async () => {
    const { right } = await import('@repo/core/shared');
    mockSignOut.mockResolvedValue(right(undefined));

    const response = await POST();

    expect(response.status).toBe(200);
  });

  it('should pass access and refresh tokens directly to gateway signOut', async () => {
    const { right } = await import('@repo/core/shared');
    mockSignOut.mockResolvedValue(right(undefined));

    await POST();

    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(mockSignOut).toHaveBeenCalledWith('access-token-123', 'refresh-token-456');
  });

  it('should clear session cookies after successful sign-out', async () => {
    const { right } = await import('@repo/core/shared');
    mockSignOut.mockResolvedValue(right(undefined));

    await POST();

    expect(mockCookieStore.delete).toHaveBeenCalledWith('sb-access-token');
    expect(mockCookieStore.delete).toHaveBeenCalledWith('sb-refresh-token');
  });

  it('should not clear cookies when gateway returns an error', async () => {
    const { left } = await import('@repo/core/shared');
    const { DomainError } = await import('@repo/core/shared');
    mockSignOut.mockResolvedValue(
      left(new DomainError('AUTH_UNEXPECTED_ERROR', { message: 'IdP error.' })),
    );

    await POST();

    expect(mockCookieStore.delete).not.toHaveBeenCalled();
  });

  it('should pass empty strings when cookies are absent', async () => {
    const { right } = await import('@repo/core/shared');
    mockCookieStore.store = {};
    mockSignOut.mockResolvedValue(right(undefined));

    await POST();

    expect(mockSignOut).toHaveBeenCalledWith('', '');
  });

  it('should return 500 when sign-out gateway throws', async () => {
    mockSignOut.mockRejectedValue(new Error('IdP unavailable'));

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
