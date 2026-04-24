import { describe, expect, it, vi } from 'vitest';

import { IUserProps, IUserRepository, Role, User } from '@repo/core/identity';
import { DomainError } from '@repo/core/shared';

import { EnsureAppUserForAuthSession } from '../../src/identity/use-cases/EnsureAppUserForAuthSession';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_AUTH_SUBJECT = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const ANOTHER_AUTH_SUBJECT = '550e8400-e29b-41d4-a716-446655440000';
const VALID_EMAIL = 'user@example.com';

const BASE_USER_PROPS: IUserProps = {
  name: 'Test User',
  email: VALID_EMAIL,
  role: Role.VISITOR,
  authSubject: VALID_AUTH_SUBJECT,
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
    save: vi.fn(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Branch 1 — found by authSubject
// ---------------------------------------------------------------------------

describe('EnsureAppUserForAuthSession — branch 1: found by authSubject', () => {
  it('should return Right(userId) without touching email or save', async () => {
    const user = makeUser();
    const repo = makeRepository({
      findByAuthSubject: vi.fn().mockResolvedValue(user),
    });

    const result = await new EnsureAppUserForAuthSession(repo).execute({
      authSubject: VALID_AUTH_SUBJECT,
      email: VALID_EMAIL,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(user.id.value);
    expect(repo.findByAuthSubject).toHaveBeenCalledOnce();
    expect(repo.findByEmail).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Branch 2 — found by email, authSubject null → link
// ---------------------------------------------------------------------------

describe('EnsureAppUserForAuthSession — branch 2: link authSubject to existing user', () => {
  it('should call linkAuthSubject and return Right(userId)', async () => {
    const user = makeUser({ authSubject: null });
    const repo = makeRepository({
      findByAuthSubject: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(user),
      linkAuthSubject: vi.fn().mockResolvedValue(undefined),
    });

    const result = await new EnsureAppUserForAuthSession(repo).execute({
      authSubject: VALID_AUTH_SUBJECT,
      email: VALID_EMAIL,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(user.id.value);
    expect(repo.linkAuthSubject).toHaveBeenCalledOnce();
    const [calledUserId, calledSubject] = (repo.linkAuthSubject as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(calledUserId.value).toBe(user.id.value);
    expect(calledSubject.value).toBe(VALID_AUTH_SUBJECT);
    expect(repo.save).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Branch 3 — found by email, authSubject already set → conflict
// ---------------------------------------------------------------------------

describe('EnsureAppUserForAuthSession — branch 3: auth subject conflict', () => {
  it('should return Left(AUTH_SUBJECT_CONFLICT) when email is linked to a different authSubject', async () => {
    const user = makeUser({ authSubject: ANOTHER_AUTH_SUBJECT });
    const repo = makeRepository({
      findByAuthSubject: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(user),
    });

    const result = await new EnsureAppUserForAuthSession(repo).execute({
      authSubject: VALID_AUTH_SUBJECT,
      email: VALID_EMAIL,
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('AUTH_SUBJECT_CONFLICT');
    expect(repo.linkAuthSubject).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Branch 4 — no user found → create VISITOR
// ---------------------------------------------------------------------------

describe('EnsureAppUserForAuthSession — branch 4: create new VISITOR user', () => {
  it('should create and save a new VISITOR user and return Right(userId)', async () => {
    const repo = makeRepository({
      findByAuthSubject: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
    });

    const result = await new EnsureAppUserForAuthSession(repo).execute({
      authSubject: VALID_AUTH_SUBJECT,
      email: VALID_EMAIL,
      defaultName: 'New User',
    });

    expect(result.isRight()).toBe(true);
    expect(typeof result.value).toBe('string');
    expect(repo.save).toHaveBeenCalledOnce();
    const saved = (repo.save as ReturnType<typeof vi.fn>).mock.calls[0]![0] as User;
    expect(saved.name.value).toBe('New User');
    expect(saved.email.value).toBe(VALID_EMAIL);
    expect(saved.role).toBe(Role.VISITOR);
    expect(saved.authSubject?.value).toBe(VALID_AUTH_SUBJECT);
  });

  it('should derive name from email prefix when defaultName is not provided', async () => {
    const repo = makeRepository({
      findByAuthSubject: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
    });

    await new EnsureAppUserForAuthSession(repo).execute({
      authSubject: VALID_AUTH_SUBJECT,
      email: 'johndoe@example.com',
    });

    const saved = (repo.save as ReturnType<typeof vi.fn>).mock.calls[0]![0] as User;
    expect(saved.name.value).toBe('johndoe');
  });
});

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

describe('EnsureAppUserForAuthSession — input validation', () => {
  it('should return Left(INVALID_AUTH_SUBJECT) when authSubject is not a valid UUID', async () => {
    const repo = makeRepository();

    const result = await new EnsureAppUserForAuthSession(repo).execute({
      authSubject: 'not-a-uuid',
      email: VALID_EMAIL,
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_AUTH_SUBJECT');
    expect(repo.findByAuthSubject).not.toHaveBeenCalled();
  });

  it('should return Left(INVALID_EMAIL) when email format is invalid', async () => {
    const repo = makeRepository();

    const result = await new EnsureAppUserForAuthSession(repo).execute({
      authSubject: VALID_AUTH_SUBJECT,
      email: 'not-an-email',
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('INVALID_EMAIL');
    expect(repo.findByAuthSubject).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Unexpected errors
// ---------------------------------------------------------------------------

describe('EnsureAppUserForAuthSession — unexpected errors', () => {
  it('should return Left(ENSURE_USER_FAILED) when repository throws', async () => {
    const repo = makeRepository({
      findByAuthSubject: vi.fn().mockRejectedValue(new Error('DB timeout')),
    });

    const result = await new EnsureAppUserForAuthSession(repo).execute({
      authSubject: VALID_AUTH_SUBJECT,
      email: VALID_EMAIL,
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as DomainError).code).toBe('ENSURE_USER_FAILED');
  });
});
