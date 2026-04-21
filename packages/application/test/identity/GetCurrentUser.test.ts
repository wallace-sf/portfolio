import { describe, expect, it, vi } from 'vitest';

import { IUserProps, IUserRepository, Role, User } from '@repo/core/identity';
import { DomainError, NotFoundError } from '@repo/core/shared';

import { GetCurrentUser } from '../../src/identity/use-cases/GetCurrentUser';
import { UserDTO } from '../../src/identity/dtos/UserDTO';

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

describe('GetCurrentUser', () => {
  describe('execute()', () => {
    it('should return Right with UserDTO when user exists', async () => {
      const user = makeUser();
      const repo = makeRepository({ findById: vi.fn().mockResolvedValue(user) });
      const useCase = new GetCurrentUser(repo);

      const result = await useCase.execute({ userId: VALID_UUID });

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeDefined();
    });

    it('should return Left with NotFoundError when user does not exist', async () => {
      const repo = makeRepository({ findById: vi.fn().mockResolvedValue(null) });
      const useCase = new GetCurrentUser(repo);

      const result = await useCase.execute({ userId: VALID_UUID });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('should return Left with DomainError when userId is not a valid UUID', async () => {
      const repo = makeRepository({ findById: vi.fn() });
      const useCase = new GetCurrentUser(repo);

      const result = await useCase.execute({ userId: 'not-a-uuid' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('INVALID_INPUT');
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findById: vi.fn().mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new GetCurrentUser(repo);

      const result = await useCase.execute({ userId: VALID_UUID });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should map all DTO fields correctly', async () => {
      const user = makeUser({ name: 'Test User', email: 'test@example.com', role: Role.VISITOR });
      const repo = makeRepository({ findById: vi.fn().mockResolvedValue(user) });
      const useCase = new GetCurrentUser(repo);

      const result = await useCase.execute({ userId: VALID_UUID });

      expect(result.isRight()).toBe(true);
      const dto = result.value as UserDTO;
      expect(dto.id).toBe(user.id.value);
      expect(dto.name).toBe('Test User');
      expect(dto.email).toBe('test@example.com');
      expect(dto.role).toBe('VISITOR');
    });

    it('should call findById with an Id VO built from userId', async () => {
      const findById = vi.fn().mockResolvedValue(null);
      const repo = makeRepository({ findById });
      const useCase = new GetCurrentUser(repo);

      await useCase.execute({ userId: VALID_UUID });

      expect(findById).toHaveBeenCalledOnce();
      const calledWith = findById.mock.calls[0]![0];
      expect(calledWith.value).toBe(VALID_UUID);
    });
  });
});
