import { describe, expect, it, vi } from 'vitest';

import {
  IUserRepository,
  Role,
  UnauthorizedError,
  User,
} from '@repo/core/identity';
import { IProjectRepository } from '@repo/core/portfolio';
import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

import { EnsureAdmin } from '~/identity/use-cases/EnsureAdmin';
import { DeleteProject } from '~/portfolio/use-cases/DeleteProject';

const ADMIN_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const VISITOR_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d470';
const PROJECT_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d471';

function makeUser(role: Role): User {
  const result = User.create({
    name: 'Test User',
    email: 'test@example.com',
    role,
  });
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
    save: vi.fn(),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeUseCase(
  user: User | null,
  projectRepo?: Partial<IProjectRepository>,
) {
  const userRepo = makeUserRepo(user);
  const ensureAdmin = new EnsureAdmin(userRepo);
  const pRepo = makeProjectRepo(projectRepo);
  return { useCase: new DeleteProject(pRepo, ensureAdmin), projectRepo: pRepo };
}

describe('DeleteProject', () => {
  describe('when user is admin', () => {
    it('should delete a project and return Right', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase, projectRepo } = makeUseCase(admin);

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        projectId: PROJECT_UUID,
      });

      expect(result.isRight()).toBe(true);
      expect(projectRepo.delete).toHaveBeenCalledOnce();
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

    it('should return Left(DomainError) when repository delete throws', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin, {
        delete: vi.fn().mockRejectedValue(new Error('DB error')),
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
