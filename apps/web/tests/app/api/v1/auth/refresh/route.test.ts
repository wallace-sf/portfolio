/**
 * @vitest-environment node
 */
import { type Container, getContainer } from '@repo/infra';

import { POST } from '~/app/api/v1/auth/refresh/route';

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

const mockRefresh = vi.fn();

beforeEach(() => {
  mockCookieStore.store = {};
  vi.clearAllMocks();

  mockCookieStore.get.mockImplementation((name: string) => {
    const value = mockCookieStore.store[name];
    return value !== undefined ? { name, value } : undefined;
  });
  mockCookieStore.set.mockImplementation((name: string, value: string) => {
    mockCookieStore.store[name] = value;
  });

  vi.mocked(getContainer).mockReturnValue({
    authGateway: {
      refreshSession: mockRefresh,
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getPrincipalFromCookies: vi.fn(),
    },
  } as unknown as Container);
});

describe('POST /api/v1/auth/refresh', () => {
  it('should return 200 and update cookies when refresh succeeds', async () => {
    const { right } = await import('@repo/core/shared');
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    mockRefresh.mockResolvedValue(
      right({ accessToken: 'new-access', refreshToken: 'new-refresh', expiresAt }),
    );

    const response = await POST();

    expect(response.status).toBe(200);
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'sb-access-token',
      'new-access',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'sb-refresh-token',
      'new-refresh',
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it('should return 401 when no refresh token is present', async () => {
    const { left } = await import('@repo/core/shared');
    const { DomainError } = await import('@repo/core/shared');
    mockRefresh.mockResolvedValue(
      left(new DomainError('NO_REFRESH_TOKEN', { message: 'No refresh token.' })),
    );

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('AUTH_REQUIRED');
  });

  it('should return 500 when refresh gateway throws', async () => {
    mockRefresh.mockRejectedValue(new Error('Network failure'));

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
