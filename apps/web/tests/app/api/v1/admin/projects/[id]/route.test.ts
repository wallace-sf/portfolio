/**
 * @vitest-environment node
 */
import { DomainError, left, right } from '@repo/core/shared';
import { type Container, getContainer } from '@repo/infra';

import { DELETE, PUT } from '~/app/api/v1/admin/projects/[id]/route';

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
const mockProjectSave = vi.fn();
const mockProjectDelete = vi.fn();
const mockLinkAuthSubject = vi.fn();

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const PROJECT_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d471';
const PRINCIPAL = { id: VALID_UUID, email: 'admin@example.com', role: 'ADMIN' };

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makeRequest(method: string, body?: unknown) {
  return new Request(`http://localhost/api/v1/admin/projects/${PROJECT_UUID}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }) as import('next/server').NextRequest;
}

const VALID_PROJECT_BODY = {
  slug: 'updated-project',
  coverImage: {
    url: 'https://example.com/cover.png',
    alt: { 'en-US': 'Cover', 'pt-BR': 'Capa' },
  },
  title: { 'en-US': 'Updated Project', 'pt-BR': 'Projeto Atualizado' },
  caption: { 'en-US': 'A caption.', 'pt-BR': 'Uma legenda.' },
  content: 'Lorem ipsum.',
  skills: [],
  period: { start: '2024-01-01' },
  featured: false,
  status: 'DRAFT',
  relatedProjects: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockCookieStore.store = {};
  mockCookieStore.get.mockImplementation((name: string) => {
    const value = mockCookieStore.store[name];
    return value !== undefined ? { name, value } : undefined;
  });
  mockProjectSave.mockResolvedValue(undefined);
  mockProjectDelete.mockResolvedValue(undefined);

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
      save: vi.fn(),
    },
    projectRepository: {
      findAll: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findPublished: vi.fn(),
      findFeatured: vi.fn(),
      findRelated: vi.fn(),
      save: mockProjectSave,
      delete: mockProjectDelete,
    },
  } as unknown as Container);
});

async function setupAdmin() {
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
  return admin.value;
}

describe('PUT /api/v1/admin/projects/[id]', () => {
  it('should return 200 when admin updates a project', async () => {
    await setupAdmin();

    const response = await PUT(
      makeRequest('PUT', VALID_PROJECT_BODY),
      makeParams(PROJECT_UUID),
    );

    expect(response.status).toBe(200);
    expect(mockProjectSave).toHaveBeenCalledOnce();
  });

  it('should return 401 when no session exists', async () => {
    mockGetPrincipal.mockResolvedValue(
      left(new DomainError('NO_ACCESS_TOKEN', { message: 'No session.' })),
    );

    const response = await PUT(
      makeRequest('PUT', VALID_PROJECT_BODY),
      makeParams(PROJECT_UUID),
    );

    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/v1/admin/projects/[id]', () => {
  it('should return 204 when admin deletes a project', async () => {
    await setupAdmin();

    const response = await DELETE(
      makeRequest('DELETE'),
      makeParams(PROJECT_UUID),
    );

    expect(response.status).toBe(204);
    expect(mockProjectDelete).toHaveBeenCalledOnce();
  });

  it('should return 401 when no session exists', async () => {
    mockGetPrincipal.mockResolvedValue(
      left(new DomainError('NO_ACCESS_TOKEN', { message: 'No session.' })),
    );

    const response = await DELETE(
      makeRequest('DELETE'),
      makeParams(PROJECT_UUID),
    );

    expect(response.status).toBe(401);
  });

  it('should return 400 when id is not a valid UUID', async () => {
    await setupAdmin();

    const response = await DELETE(
      makeRequest('DELETE'),
      makeParams('not-a-uuid'),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBeDefined();
  });
});
