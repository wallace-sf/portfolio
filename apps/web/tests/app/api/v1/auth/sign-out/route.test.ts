/**
 * @vitest-environment node
 */
import { type Container, getContainer } from '@repo/infra';

import { POST } from '~/app/api/v1/auth/sign-out/route';

vi.mock('@repo/infra', () => ({
  getContainer: vi.fn(),
}));

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

const mockSignOut = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

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

  it('should pass cookie api to gateway signOut', async () => {
    const { right } = await import('@repo/core/shared');
    mockSignOut.mockResolvedValue(right(undefined));

    await POST();

    expect(mockSignOut).toHaveBeenCalledOnce();
    const cookieArg = mockSignOut.mock.calls[0]![0];
    expect(typeof cookieArg.get).toBe('function');
    expect(typeof cookieArg.set).toBe('function');
    expect(typeof cookieArg.delete).toBe('function');
  });

  it('should return 500 when sign-out gateway throws', async () => {
    mockSignOut.mockRejectedValue(new Error('IdP unavailable'));

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
