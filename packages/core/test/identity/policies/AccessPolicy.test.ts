import { AccessPolicy, Role, User } from '../../../src';

describe('AccessPolicy', () => {
  describe('isAdmin', () => {
    it('should return true for admin user', () => {
      const result = User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        role: Role.ADMIN,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(AccessPolicy.isAdmin(result.value)).toBe(true);
    });

    it('should return false for visitor user', () => {
      const result = User.create({
        name: 'Visitor User',
        email: 'visitor@example.com',
        role: Role.VISITOR,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(AccessPolicy.isAdmin(result.value)).toBe(false);
    });
  });

  describe('isVisitor', () => {
    it('should return true for visitor user', () => {
      const result = User.create({
        name: 'Visitor User',
        email: 'visitor@example.com',
        role: Role.VISITOR,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(AccessPolicy.isVisitor(result.value)).toBe(true);
    });

    it('should return false for admin user', () => {
      const result = User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        role: Role.ADMIN,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(AccessPolicy.isVisitor(result.value)).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has specified role', () => {
      const result = User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        role: Role.ADMIN,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(AccessPolicy.hasRole(result.value, Role.ADMIN)).toBe(true);
      expect(AccessPolicy.hasRole(result.value, Role.VISITOR)).toBe(false);
    });
  });
});
