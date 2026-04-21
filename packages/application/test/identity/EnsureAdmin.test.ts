import { describe, expect, it, vi } from 'vitest';

import { IUserProps, IUserRepository, Role, User } from '@repo/core/identity';
import { DomainError, NotFoundError } from '@repo/core/shared';
import { UnauthorizedError } from '@repo/core/identity';

import { EnsureAdmin } from '../../src/identity/use-cases/EnsureAdmin';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

const BASE_USER_PROPS: IUserProps = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: Role.ADMIN,
};

function makeUser(overrides: Partial<IUserProps> = {}): User {
  const result = User.create({ ...BASE_USER_PROPS, ...overrides });
  if (result.isLeft()) throw new Error(`makeUser failed: ${result.value.message}`);
  return result.value;
}

function makeRepository(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByAuthSubject: vi.fn(),
    linkAuthSubject: vi.fn(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EnsureAdmin', () => {
  describe('execute()', () => {
    it('should return Right(void) when user is admin', async () => {
      const adminUser = makeUser({ role: Role.ADMIN });
      const repo = makeRepository({ findById: vi.fn().mockResolvedValue(adminUser) });
      const useCase = new EnsureAdmin(repo);

      const result = await useCase.execute({ userId: VALID_UUID });

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it('should return Left with UnauthorizedError when user is not admin', async () => {
      const visitorUser = makeUser({ role: Role.VISITOR });
      const repo = makeRepository({ findById: vi.fn().mockResolvedValue(visitorUser) });
      const useCase = new EnsureAdmin(repo);

      const result = await useCase.execute({ userId: VALID_UUID });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UnauthorizedError);
    });

    it('should return Left with NotFoundError when user does not exist', async () => {
      const repo = makeRepository({ findById: vi.fn().mockResolvedValue(null) });
      const useCase = new EnsureAdmin(repo);

      const result = await useCase.execute({ userId: VALID_UUID });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('should return Left with DomainError when userId is not a valid UUID', async () => {
      const repo = makeRepository({ findById: vi.fn() });
      const useCase = new EnsureAdmin(repo);

      const result = await useCase.execute({ userId: 'not-a-uuid' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('INVALID_INPUT');
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findById: vi.fn().mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new EnsureAdmin(repo);

      const result = await useCase.execute({ userId: VALID_UUID });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should call findById with an Id VO built from userId', async () => {
      const findById = vi.fn().mockResolvedValue(null);
      const repo = makeRepository({ findById });
      const useCase = new EnsureAdmin(repo);

      await useCase.execute({ userId: VALID_UUID });

      expect(findById).toHaveBeenCalledOnce();
      const calledWith = findById.mock.calls[0]![0];
      expect(calledWith.value).toBe(VALID_UUID);
    });

    it('should not call findByEmail or any write operation', async () => {
      const findByEmail = vi.fn();
      const adminUser = makeUser({ role: Role.ADMIN });
      const repo = makeRepository({
        findById: vi.fn().mockResolvedValue(adminUser),
        findByEmail,
      });
      const useCase = new EnsureAdmin(repo);

      await useCase.execute({ userId: VALID_UUID });

      expect(findByEmail).not.toHaveBeenCalled();
    });
  });
});
