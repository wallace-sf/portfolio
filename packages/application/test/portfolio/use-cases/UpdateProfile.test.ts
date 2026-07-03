import { describe, expect, it, vi } from 'vitest';

import { IUserRepository, Role, UnauthorizedError, User } from '@repo/core/identity';
import { IProfileProps, IProfileRepository } from '@repo/core/portfolio';
import { DomainError, NotFoundError } from '@repo/core/shared';

import { EnsureAdmin } from '~/identity/use-cases/EnsureAdmin';
import { UpdateProfile } from '~/portfolio/use-cases/UpdateProfile';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ADMIN_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const VISITOR_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d470';

const VALID_PROFILE_PROPS: IProfileProps = {
  name: 'Wallace',
  headline: { 'en-US': 'Software Engineer', 'pt-BR': 'Engenheiro de Software' },
  bio: {
    'en-US': 'Developer passionate about DDD.',
    'pt-BR': 'Desenvolvedor apaixonado por DDD.',
  },
  photo: {
    url: 'https://example.com/photo.png',
    alt: { 'en-US': 'Photo', 'pt-BR': 'Foto' },
  },
  stats: [
    { label: { 'en-US': 'Years', 'pt-BR': 'Anos' }, value: '5+', icon: 'briefcase' },
  ],
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

function makeProfileRepo(
  overrides: Partial<IProfileRepository> = {},
): IProfileRepository {
  return {
    find: vi.fn(),
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeUseCase(user: User | null, profileRepo?: Partial<IProfileRepository>) {
  const userRepo = makeUserRepo(user);
  const ensureAdmin = new EnsureAdmin(userRepo);
  const pRepo = makeProfileRepo(profileRepo);
  return { useCase: new UpdateProfile(pRepo, ensureAdmin), profileRepo: pRepo };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('UpdateProfile', () => {
  describe('when user is admin', () => {
    it('should save profile and return Right', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase, profileRepo } = makeUseCase(admin);

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        profileProps: VALID_PROFILE_PROPS,
      });

      expect(result.isRight()).toBe(true);
      expect(profileRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should return Left(DomainError) when repository throws', async () => {
      const admin = makeUser(Role.ADMIN);
      const { useCase } = makeUseCase(admin, {
        save: vi.fn().mockRejectedValue(new Error('DB error')),
      });

      const result = await useCase.execute({
        userId: ADMIN_UUID,
        profileProps: VALID_PROFILE_PROPS,
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
        profileProps: VALID_PROFILE_PROPS,
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
        profileProps: VALID_PROFILE_PROPS,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });
  });
});
