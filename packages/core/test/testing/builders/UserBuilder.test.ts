import { Role, User } from '~/identity';
import { UserBuilder } from '~/testing';

describe('UserBuilder', () => {
  it('should build a valid admin user when using the defaults', () => {
    const user = UserBuilder.build().now();

    expect(user).toBeInstanceOf(User);
    expect(user.isAdmin()).toBe(true);
    expect(user.authSubject).not.toBeNull();
  });

  it('should apply overrides when with* methods are chained', () => {
    const user = UserBuilder.build()
      .withName('Visitor User')
      .withEmail('visitor@example.com')
      .withRole(Role.VISITOR)
      .withAuthSubject(null)
      .withId('c0000000-0000-4000-8000-000000000001')
      .now();

    expect(user.name.value).toBe('Visitor User');
    expect(user.email.value).toBe('visitor@example.com');
    expect(user.isVisitor()).toBe(true);
    expect(user.authSubject).toBeNull();
    expect(user.id.value).toBe('c0000000-0000-4000-8000-000000000001');
  });

  it('should throw when the props are invalid', () => {
    expect(() => UserBuilder.build().withEmail('not-an-email').now()).toThrow();
  });
});
