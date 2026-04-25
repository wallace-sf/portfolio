/**
 * @vitest-environment node
 */
import { Role, User } from '@repo/core/identity';
import { DomainError, left, right } from '@repo/core/shared';
import { type Container, getContainer } from '@repo/infra';

import { GET } from '~/app/api/v1/me/route';

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
const mockFindById = vi.fn();
const mockSave = vi.fn();
const mockLinkAuthSubject = vi.fn();

beforeEach(() => {
  mockCookieStore.store = {};
  vi.clearAllMocks();

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
      findById: mockFindById,
      findByEmail: mockFindByEmail,
      findByAuthSubject: mockFindByAuthSubject,
      linkAuthSubject: mockLinkAuthSubject,
      save: mockSave,
    },
  } as unknown as Container);
});

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const PRINCIPAL = { id: VALID_UUID, email: 'user@example.com', role: 'VISITOR' };

function makeUser(name: string) {
  const result = User.create({
    name,
    email: 'user@example.com',
    role: Role.VISITOR,
    authSubject: VALID_UUID,
  });
  if (result.isLeft()) throw new Error(`makeUser failed: ${result.value.message}`);
  return result.value;
}

describe('GET /api/v1/me', () => {
  it('should return 401 when no session cookie is present', async () => {
    mockGetPrincipal.mockResolvedValue(
      left(new DomainError('NO_ACCESS_TOKEN', { message: 'No session.' })),
    );

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('AUTH_REQUIRED');
  });

  it('should return 401 when access token is invalid', async () => {
    mockGetPrincipal.mockResolvedValue(
      left(new DomainError('INVALID_ACCESS_TOKEN', { message: 'Token expired.' })),
    );

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('AUTH_REQUIRED');
  });

  it('should return 200 with user data when session is valid and user is new', async () => {
    const user = makeUser('Test User');

    mockGetPrincipal.mockResolvedValue(right(PRINCIPAL));
    mockFindByAuthSubject.mockResolvedValue(null);
    mockFindByEmail.mockResolvedValue(null);
    mockSave.mockResolvedValue(undefined);
    mockFindById.mockResolvedValue(user);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.email).toBe('user@example.com');
  });

  it('should return 200 when user already exists by authSubject', async () => {
    const user = makeUser('Existing User');

    mockGetPrincipal.mockResolvedValue(right(PRINCIPAL));
    mockFindByAuthSubject.mockResolvedValue(user);
    mockFindById.mockResolvedValue(user);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(mockFindByAuthSubject).toHaveBeenCalledOnce();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('should return 500 when gateway throws', async () => {
    mockGetPrincipal.mockRejectedValue(new Error('Unexpected error'));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
