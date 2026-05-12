import { describe, expect, it, vi } from 'vitest';

import { IUserRepository, Role, UnauthorizedError, User } from '@repo/core/identity';
import {
  IProjectProps,
  IProjectRepository,
  Project,
  ProjectStatus,
} from '@repo/core/portfolio';
import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

import { EnsureAdmin } from '~/identity/use-cases/EnsureAdmin';
import { PublishProject } from '~/portfolio/use-cases/PublishProject';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ADMIN_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const VISITOR_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d470';
const PROJECT_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d471';

const BASE_PROJECT_PROPS: IProjectProps = {
  slug: 'my-project',
  coverImage: {
    url: 'https://example.com/cover.png',
    alt: { 'en-US': 'Cover', 'pt-BR': 'Capa' },
  },
  title: { 'en-US': 'My Project', 'pt-BR': 'Meu Projeto' },
  caption: { 'en-US': 'A caption.', 'pt-BR': 'Uma legenda.' },
  content: 'Lorem ipsum dolor sit amet.',
  skills: ['a0000000-0000-4000-8000-000000000001'],
  period: { start: '2024-01-01' },
  featured: false,
  status: ProjectStatus.DRAFT,
  relatedProjects: [],
};

function makeProject(status: ProjectStatus): Project {
  const result = Project.create({ ...BASE_PROJECT_PROPS, status });
  if (result.isLeft()) throw result.value;
  return result.value;
}

function makeUser(role: Role): User {
  const result = User.create({ name: 'Test User', email: 'test@example.com', role });
  if (result.isLeft()) throw result.value;
  return result.value;
}

function makeUserRepo(user: User | null): IUserRepository {
  return {
    findById: vi.fn().mockResolvedValue(user),
    findByEmail: vi.fn(),
    findByAuthSubject: vi.fn(),
    linkAuthSubject: vi.fn(),
  };
}

function makeProjectRepo(
  overrides: Partial<IProjectRepository> = {},
): IProjectRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn().mockResolvedValue(null),
    findBySlug: vi.fn(),
    findPublished: vi.fn(),
    findFeatured: vi.fn(),
    findRelated: vi.fn(),
    save: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn(),
    ...overrides,
  };
}

function makeUseCase(user: User | null, projectRepo?: Partial<IProjectRepository>) {
  const userRepo = makeUserRepo(user);
  const ensureAdmin = new EnsureAdmin(userRepo);
  const pRepo = makeProjectRepo(projectRepo);
  return { useCase: new PublishProject(pRepo, ensureAdmin), projectRepo: pRepo };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('PublishProject', () => {
  describe('when user is admin', () => {
    it('should publish a DRAFT project and return Right', async () => {
      const admin = makeUser(Role.ADMIN);
      const project = makeProject(ProjectStatus.DRAFT);
      const { useCase, projectRepo } = makeUseCase(admin, {
        findById: vi.fn().mockResolvedValue(project),
      });

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        projectId: PROJECT_UUID,
      });

      expect(result.isRight()).toBe(true);
      expect(project.status).toBe(ProjectStatus.PUBLISHED);
      expect(projectRepo.save).toHaveBeenCalledWith(project);
    });

    it('should return Left(ValidationError) when project is already published', async () => {
      const admin = makeUser(Role.ADMIN);
      const project = makeProject(ProjectStatus.PUBLISHED);
      const { useCase } = makeUseCase(admin, {
        findById: vi.fn().mockResolvedValue(project),
      });

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        projectId: PROJECT_UUID,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should return Left(NotFoundError) when project does not exist', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin, {
        findById: vi.fn().mockResolvedValue(null),
      });

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        projectId: PROJECT_UUID,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('should return Left(ValidationError) when projectId is not a valid UUID', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin);

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        projectId: 'not-a-uuid',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should return Left(DomainError) when repository fetch throws', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin, {
        findById: vi.fn().mockRejectedValue(new Error('DB error')),
      });

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        projectId: PROJECT_UUID,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
    });

    it('should return Left(DomainError) when repository save throws', async () => {
      const admin = makeUser(Role.ADMIN);
      const project = makeProject(ProjectStatus.DRAFT);
      const { useCase } = makeUseCase(admin, {
        findById: vi.fn().mockResolvedValue(project),
        save: vi.fn().mockRejectedValue(new Error('DB error')),
      });

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        projectId: PROJECT_UUID,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
    });
  });

  describe('when user is not admin', () => {
    it('should return Left(UnauthorizedError)', async () => {
      const visitor = makeUser(Role.VISITOR);
      const { useCase } = makeUseCase(visitor);

      const result = await useCase.execute({
        userId: VISITOR_UUID,
        projectId: PROJECT_UUID,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe('when user does not exist', () => {
    it('should return Left(NotFoundError)', async () => {
      const { useCase } = makeUseCase(null);

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        projectId: PROJECT_UUID,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });
  });
});
