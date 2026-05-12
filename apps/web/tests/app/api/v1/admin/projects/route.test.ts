/**
 * @vitest-environment node
 */
import { UnauthorizedError } from '@repo/core/identity';
import { DomainError, ValidationError, left, right } from '@repo/core/shared';
import { type Container, getContainer } from '@repo/infra';

import { POST } from '~/app/api/v1/admin/projects/route';

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

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const PRINCIPAL = { id: VALID_UUID, email: 'admin@example.com', role: 'ADMIN' };

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/v1/admin/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as import('next/server').NextRequest;
}

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
      findById: mockFindById,
      findByEmail: mockFindByEmail,
      findByAuthSubject: mockFindByAuthSubject,
      linkAuthSubject: mockLinkAuthSubject,
      save: mockSave,
    },
    projectRepository: {
      findAll: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findPublished: vi.fn(),
      findFeatured: vi.fn(),
      findRelated: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
    },
  } as unknown as Container);
});

const VALID_PROJECT_BODY = {
  slug: 'my-project',
  coverImage: {
    url: 'https://example.com/cover.png',
    alt: { 'en-US': 'Cover', 'pt-BR': 'Capa' },
  },
  title: { 'en-US': 'My Project', 'pt-BR': 'Meu Projeto' },
  caption: { 'en-US': 'A caption.', 'pt-BR': 'Uma legenda.' },
  content: 'Lorem ipsum.',
  skills: [],
  period: { start: '2024-01-01' },
  featured: false,
  status: 'DRAFT',
  relatedProjects: [],
};

describe('POST /api/v1/admin/projects', () => {
  it('should return 401 when no session exists', async () => {
    mockGetPrincipal.mockResolvedValue(
      left(new DomainError('NO_ACCESS_TOKEN', { message: 'No session.' })),
    );

    const response = await POST(makeRequest(VALID_PROJECT_BODY));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBeDefined();
  });

  it('should return 401 when user is not admin', async () => {
    const { Role, User } = await import('@repo/core/identity');
    const visitor = User.create({
      name: 'Visitor',
      email: 'v@example.com',
      role: Role.VISITOR,
      authSubject: VALID_UUID,
    });
    if (visitor.isLeft()) throw visitor.value;

    mockGetPrincipal.mockResolvedValue(right(PRINCIPAL));
    mockFindByAuthSubject.mockResolvedValue(visitor.value);
    mockFindById.mockResolvedValue(visitor.value);

    const response = await POST(makeRequest(VALID_PROJECT_BODY));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBeDefined();
  });

  it('should return 201 when admin creates a valid project', async () => {
    const { Role, User } = await import('@repo/core/identity');
    const admin = User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role: Role.ADMIN,
      authSubject: VALID_UUID,
    });
    if (admin.isLeft()) throw admin.value;

    mockGetPrincipal.mockResolvedValue(right(PRINCIPAL));
    mockFindByAuthSubject.mockResolvedValue(admin.value);
    mockFindById.mockResolvedValue(admin.value);
    mockSave.mockResolvedValue(undefined);

    const response = await POST(makeRequest(VALID_PROJECT_BODY));

    expect(response.status).toBe(201);
  });

  it('should return 400 when project props are invalid', async () => {
    const { Role, User } = await import('@repo/core/identity');
    const admin = User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role: Role.ADMIN,
      authSubject: VALID_UUID,
    });
    if (admin.isLeft()) throw admin.value;

    mockGetPrincipal.mockResolvedValue(right(PRINCIPAL));
    mockFindByAuthSubject.mockResolvedValue(admin.value);
    mockFindById.mockResolvedValue(admin.value);

    const response = await POST(makeRequest({ slug: '' }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBeDefined();
  });
});
