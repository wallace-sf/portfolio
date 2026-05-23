import { describe, expect, it, vi } from 'vitest';

import { IUserProps, IUserRepository, Role, User } from '@repo/core/identity';
import { DomainError } from '@repo/core/shared';

import { AuthPrincipal } from '../../src/identity/dtos/AuthPrincipal';
import { SignIn } from '../../src/identity/use-cases/SignIn';
import { FakeAuthenticationGateway } from './FakeAuthenticationGateway';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_UUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const VALID_EMAIL = 'admin@example.com';
const VALID_PASSWORD = 'secret123';

const PRINCIPAL: AuthPrincipal = {
  id: VALID_UUID,
  email: VALID_EMAIL,
  role: 'ADMIN',
};

const BASE_USER_PROPS: IUserProps = {
  name: 'Admin User',
  email: VALID_EMAIL,
  role: Role.ADMIN,
  authSubject: VALID_UUID,
};

function makeUser(overrides: Partial<IUserProps> = {}): User {
  const result = User.create({ ...BASE_USER_PROPS, ...overrides });
  if (result.isLeft()) throw new Error(`makeUser failed: ${result.value.message}`);
  return result.value;
}

function makeRepository(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return {
    findById: vi.fn(),
    findByEmail: vi.fn().mockResolvedValue(null),
    findByAuthSubject: vi.fn().mockResolvedValue(null),
    linkAuthSubject: vi.fn(),
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeGateway(): FakeAuthenticationGateway {
  return new FakeAuthenticationGateway({
    [VALID_EMAIL]: { password: VALID_PASSWORD, principal: PRINCIPAL },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SignIn', () => {
  describe('execute()', () => {
    it('should return Right(AuthSession) on valid credentials', async () => {
      const gateway = makeGateway();
      const repo = makeRepository();
      const useCase = new SignIn(gateway, repo);

      const result = await useCase.execute({ email: VALID_EMAIL, password: VALID_PASSWORD });

      expect(result.isRight()).toBe(true);
      expect(result.value).toMatchObject({
        accessToken: expect.stringContaining('access:'),
        refreshToken: expect.stringContaining('refresh:'),
      });
    });

    it('should return Left with DomainError when credentials are invalid', async () => {
      const gateway = makeGateway();
      const repo = makeRepository();
      const useCase = new SignIn(gateway, repo);

      const result = await useCase.execute({ email: VALID_EMAIL, password: 'wrong' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('INVALID_CREDENTIALS');
    });

    it('should return Left when getPrincipalFromSession fails', async () => {
      const gateway = makeGateway();
      gateway.simulateError(
        new DomainError('INVALID_ACCESS_TOKEN', { message: 'Token validation failed.' }),
      );
      const repo = makeRepository();
      const useCase = new SignIn(gateway, repo);

      const result = await useCase.execute({ email: VALID_EMAIL, password: VALID_PASSWORD });

      expect(result.isLeft()).toBe(true);
      expect((result.value as DomainError).code).toBe('INVALID_ACCESS_TOKEN');
    });

    it('should return Left when EnsureAppUserForAuthSession fails', async () => {
      const gateway = makeGateway();
      const repo = makeRepository({
        findByAuthSubject: vi.fn().mockResolvedValue(null),
        findByEmail: vi.fn().mockRejectedValue(new Error('DB error')),
      });
      const useCase = new SignIn(gateway, repo);

      const result = await useCase.execute({ email: VALID_EMAIL, password: VALID_PASSWORD });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
    });

    it('should upsert the app user after successful sign-in', async () => {
      const gateway = makeGateway();
      const save = vi.fn().mockResolvedValue(undefined);
      const repo = makeRepository({ save });
      const useCase = new SignIn(gateway, repo);

      await useCase.execute({ email: VALID_EMAIL, password: VALID_PASSWORD });

      expect(save).toHaveBeenCalledOnce();
    });

    it('should not call save when user already exists', async () => {
      const gateway = makeGateway();
      const existingUser = makeUser();
      const save = vi.fn();
      const repo = makeRepository({
        findByAuthSubject: vi.fn().mockResolvedValue(existingUser),
        save,
      });
      const useCase = new SignIn(gateway, repo);

      const result = await useCase.execute({ email: VALID_EMAIL, password: VALID_PASSWORD });

      expect(result.isRight()).toBe(true);
      expect(save).not.toHaveBeenCalled();
    });
  });
});
