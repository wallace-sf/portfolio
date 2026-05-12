import { describe, expect, it, vi } from 'vitest';

import { IUserRepository, Role, UnauthorizedError, User } from '@repo/core/identity';
import { IExperienceRepository } from '@repo/core/portfolio';
import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

import { EnsureAdmin } from '~/identity/use-cases/EnsureAdmin';
import { DeleteExperience } from '~/portfolio/use-cases/DeleteExperience';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ADMIN_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const VISITOR_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d470';
const EXPERIENCE_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d471';

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

function makeExperienceRepo(
  overrides: Partial<IExperienceRepository> = {},
): IExperienceRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeUseCase(user: User | null, experienceRepo?: Partial<IExperienceRepository>) {
  const userRepo = makeUserRepo(user);
  const ensureAdmin = new EnsureAdmin(userRepo);
  const eRepo = makeExperienceRepo(experienceRepo);
  return { useCase: new DeleteExperience(eRepo, ensureAdmin), experienceRepo: eRepo };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DeleteExperience', () => {
  describe('when user is admin', () => {
    it('should delete experience and return Right', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase, experienceRepo } = makeUseCase(admin);

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        experienceId: EXPERIENCE_UUID,
      });

      expect(result.isRight()).toBe(true);
      expect(experienceRepo.delete).toHaveBeenCalledTimes(1);
    });

    it('should return Left(ValidationError) when experienceId is not a valid UUID', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin);

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        experienceId: 'not-a-uuid',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should return Left(DomainError) when repository throws', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin, {
        delete: vi.fn().mockRejectedValue(new Error('DB error')),
      });

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        experienceId: EXPERIENCE_UUID,
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
        experienceId: EXPERIENCE_UUID,
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
        experienceId: EXPERIENCE_UUID,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });
  });
});
