/**
 * @vitest-environment node
 */
import { type Container, getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { POST } from '~/app/api/v1/auth/sign-in/route';

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

const mockSignIn = vi.fn();
const mockGetPrincipal = vi.fn();
const mockEnsureUser = vi.fn();

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
      signInWithPassword: mockSignIn,
      getPrincipalFromCookies: mockGetPrincipal,
      signOut: vi.fn(),
      refreshSession: vi.fn(),
    },
    userRepository: {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByAuthSubject: vi.fn(),
      linkAuthSubject: vi.fn(),
      save: vi.fn(),
    },
  } as unknown as Container);
});

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/v1/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/v1/auth/sign-in', () => {
  it('should return 400 when body is not valid JSON', async () => {
    const request = new NextRequest('http://localhost/api/v1/auth/sign-in', {
      method: 'POST',
      body: 'not-json{{{',
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_INPUT');
  });

  it('should return 400 when body is not an object', async () => {
    const response = await POST(makeRequest(42));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_INPUT');
  });

  it('should return 401 when credentials are invalid', async () => {
    const { left } = await import('@repo/core/shared');
    const { DomainError } = await import('@repo/core/shared');
    mockSignIn.mockResolvedValue(
      left(new DomainError('INVALID_CREDENTIALS', { message: 'Wrong password' })),
    );

    const response = await POST(
      makeRequest({ email: 'user@example.com', password: 'wrong' }),
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  it('should return 200 and set cookies when sign-in succeeds', async () => {
    const { right } = await import('@repo/core/shared');
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;

    const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    mockSignIn.mockResolvedValue(
      right({ accessToken: 'access-123', refreshToken: 'refresh-456', expiresAt }),
    );
    mockGetPrincipal.mockResolvedValue(
      right({ id: VALID_UUID, email: 'user@example.com', role: 'VISITOR' }),
    );

    // Wire EnsureAppUserForAuthSession via userRepository mocks
    const container = vi.mocked(getContainer)();
    vi
      .spyOn(container.userRepository, 'findByAuthSubject')
      .mockResolvedValue(null);
    vi
      .spyOn(container.userRepository, 'findByEmail')
      .mockResolvedValue(null);
    vi.spyOn(container.userRepository, 'save').mockResolvedValue(undefined);

    const response = await POST(
      makeRequest({ email: 'user@example.com', password: 'secret' }),
    );

    expect(response.status).toBe(200);
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'sb-access-token',
      'access-123',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'sb-refresh-token',
      'refresh-456',
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it('should return 500 when sign-in gateway throws', async () => {
    mockSignIn.mockRejectedValue(new Error('Network failure'));

    const response = await POST(
      makeRequest({ email: 'user@example.com', password: 'secret' }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
