import { describe, expect, it, vi } from 'vitest';

import { IUserRepository, Role, UnauthorizedError, User } from '@repo/core/identity';
import {
  EmploymentType,
  IExperienceProps,
  IExperienceRepository,
  LocationType,
} from '@repo/core/portfolio';
import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

import { EnsureAdmin } from '~/identity/use-cases/EnsureAdmin';
import { SaveExperience } from '~/portfolio/use-cases/SaveExperience';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ADMIN_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const VISITOR_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d470';

const VALID_EXPERIENCE_PROPS: IExperienceProps = {
  company: { 'en-US': 'Portfolio Inc', 'pt-BR': 'Portfolio Inc' },
  position: { 'en-US': 'Software Engineer', 'pt-BR': 'Engenheiro de Software' },
  location: { 'en-US': 'São Paulo, Brazil', 'pt-BR': 'São Paulo, Brasil' },
  description: {
    'en-US': 'Developed features for the platform.',
    'pt-BR': 'Desenvolveu funcionalidades para a plataforma.',
  },
  logo: {
    url: 'https://example.com/logo.png',
    alt: { 'en-US': 'Logo', 'pt-BR': 'Logo' },
  },
  employment_type: EmploymentType.FULL_TIME,
  location_type: LocationType.REMOTE,
  start_at: '2022-01-01T00:00:00.000Z',
  skills: ['a0000000-0000-4000-8000-000000000001'],
};

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
    save: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn(),
    ...overrides,
  };
}

function makeUseCase(user: User | null, experienceRepo?: Partial<IExperienceRepository>) {
  const userRepo = makeUserRepo(user);
  const ensureAdmin = new EnsureAdmin(userRepo);
  const eRepo = makeExperienceRepo(experienceRepo);
  return { useCase: new SaveExperience(eRepo, ensureAdmin), experienceRepo: eRepo };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SaveExperience', () => {
  describe('when user is admin', () => {
    it('should save experience and return Right', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase, experienceRepo } = makeUseCase(admin);

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        experienceProps: VALID_EXPERIENCE_PROPS,
      });

      expect(result.isRight()).toBe(true);
      expect(experienceRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should return Left(ValidationError) when experience props are invalid', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin);

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        experienceProps: {
          ...VALID_EXPERIENCE_PROPS,
          employment_type: 'INVALID' as EmploymentType,
        },
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should return Left(DomainError) when repository throws', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin, {
        save: vi.fn().mockRejectedValue(new Error('DB error')),
      });

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        experienceProps: VALID_EXPERIENCE_PROPS,
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
        experienceProps: VALID_EXPERIENCE_PROPS,
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
        experienceProps: VALID_EXPERIENCE_PROPS,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });
  });
});
