import { User, Role, ValidationError, UnauthorizedError } from '~/index';

describe('User', () => {
  describe('when created from valid props', () => {
    it('should return Right with valid User', () => {
      const result = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        role: Role.ADMIN,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value).toBeInstanceOf(User);
      expect(result.value.name.value).toBe('John Doe');
      expect(result.value.email.value).toBe('john@example.com');
      expect(result.value.role).toBe(Role.ADMIN);
    });

    it('should create visitor user', () => {
      const result = User.create({
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: Role.VISITOR,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.role).toBe(Role.VISITOR);
    });

    it('should create user with valid authSubject', () => {
      const sub = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const result = User.create({
        name: 'Linked User',
        email: 'linked@example.com',
        role: Role.VISITOR,
        authSubject: sub,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.authSubject?.value).toBe(sub);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left for invalid email', () => {
      const result = User.create({
        name: 'John Doe',
        email: 'invalid-email',
        role: Role.ADMIN,
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).message).toContain(
        'valid format',
      );
    });

    it('should return Left for invalid name', () => {
      const result = User.create({
        name: '123',
        email: 'john@example.com',
        role: Role.ADMIN,
      });

      expect(result.isLeft()).toBe(true);
    });

    it('should return Left for invalid role', () => {
      const result = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'INVALID_ROLE' as Role,
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(User.ERROR_CODE);
      expect((result.value as ValidationError).message).toContain(
        'Role must be one of',
      );
    });

    it('should return Left for invalid authSubject', () => {
      const result = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        role: Role.ADMIN,
        authSubject: 'not-a-uuid',
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(User.ERROR_CODE);
    });
  });

  describe('role checking methods', () => {
    it('should return true for isAdmin when role is ADMIN', () => {
      const result = User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        role: Role.ADMIN,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.isAdmin()).toBe(true);
      expect(result.value.isVisitor()).toBe(false);
    });

    it('should return true for isVisitor when role is VISITOR', () => {
      const result = User.create({
        name: 'Guest User',
        email: 'guest@example.com',
        role: Role.VISITOR,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.isVisitor()).toBe(true);
      expect(result.value.isAdmin()).toBe(false);
    });
  });

  describe('UnauthorizedError', () => {
    it('should have code UNAUTHORIZED', () => {
      const err = new UnauthorizedError();
      expect(err.code).toBe('UNAUTHORIZED');
    });

    it('should have default message', () => {
      const err = new UnauthorizedError();
      expect(err.message).toBe('Unauthorized access');
    });

    it('should accept custom message', () => {
      const err = new UnauthorizedError({ message: 'Custom message' });
      expect(err.message).toBe('Custom message');
    });
  });
});
