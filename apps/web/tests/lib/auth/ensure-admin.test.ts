/**
 * @vitest-environment node
 */
import { DomainError, left, right } from '@repo/core/shared';
import { type Container, getContainer } from '@repo/infra';

import { resolveSessionUserId } from '~/lib/auth/ensure-admin';

vi.mock('@repo/infra', () => ({
  getContainer: vi.fn(),
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

const mockGetPrincipal = vi.fn();
const mockFindByAuthSubject = vi.fn();
const mockFindByEmail = vi.fn();

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const PRINCIPAL = { id: VALID_UUID, email: 'admin@example.com', role: 'ADMIN' };

beforeEach(() => {
  vi.clearAllMocks();
  mockCookieStore.store = {};
  mockCookieStore.get.mockImplementation((name: string) => {
    const value = mockCookieStore.store[name];
    return value !== undefined ? { name, value } : undefined;
  });

  vi.mocked(getContainer).mockReturnValue({
    authGateway: {
      getPrincipalFromCookies: mockGetPrincipal,
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      refreshSession: vi.fn(),
    },
    userRepository: {
      findById: vi.fn(),
      findByEmail: mockFindByEmail,
      findByAuthSubject: mockFindByAuthSubject,
      linkAuthSubject: vi.fn(),
      save: vi.fn(),
    },
  } as unknown as Container);
});

describe('resolveSessionUserId', () => {
  it('should return Left when no session cookie exists', async () => {
    mockGetPrincipal.mockResolvedValue(
      left(new DomainError('NO_ACCESS_TOKEN', { message: 'No session.' })),
    );

    const result = await resolveSessionUserId();

    expect(result.isLeft()).toBe(true);
  });

  it('should return Left when auth token is invalid', async () => {
    mockGetPrincipal.mockResolvedValue(
      left(
        new DomainError('INVALID_ACCESS_TOKEN', { message: 'Token expired.' }),
      ),
    );

    const result = await resolveSessionUserId();

    expect(result.isLeft()).toBe(true);
  });

  it('should return Right(userId) when session is valid and user exists', async () => {
    mockGetPrincipal.mockResolvedValue(right(PRINCIPAL));
    mockFindByAuthSubject.mockResolvedValue(null);
    mockFindByEmail.mockResolvedValue(null);
    vi.mocked(getContainer).mockReturnValue({
      ...vi.mocked(getContainer)(),
      userRepository: {
        findById: vi.fn(),
        findByEmail: mockFindByEmail,
        findByAuthSubject: mockFindByAuthSubject,
        linkAuthSubject: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined),
      },
    } as unknown as Container);

    const result = await resolveSessionUserId();

    expect(result.isRight()).toBe(true);
    expect(typeof result.value).toBe('string');
  });

  it('should return Right(userId) when user is already linked by authSubject', async () => {
    const { Role, User } = await import('@repo/core/identity');
    const userResult = User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role: Role.ADMIN,
      authSubject: VALID_UUID,
    });
    if (userResult.isLeft()) throw userResult.value;
    const user = userResult.value;

    mockGetPrincipal.mockResolvedValue(right(PRINCIPAL));
    mockFindByAuthSubject.mockResolvedValue(user);

    const result = await resolveSessionUserId();

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(user.id.value);
  });
});
