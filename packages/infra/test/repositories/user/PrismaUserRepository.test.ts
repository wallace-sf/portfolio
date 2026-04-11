import { PrismaClient } from '@prisma/client';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { Id } from '@repo/core/shared';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { PrismaUserRepository } from '../../../src/repositories/user/PrismaUserRepository';
import { UserMapper } from '../../../src/repositories/user/UserMapper';
import { buildPrismaUser } from '../../factories/prisma-user.factory';

// Use DIRECT_URL to bypass PgBouncer — prepared statements don't work with the pooler
const db = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});
const repo = new PrismaUserRepository(db);

const TEST_EMAIL_PREFIX = 'infra-test-';

async function seedUser(overrides?: Partial<ReturnType<typeof buildPrismaUser>>) {
  const raw = buildPrismaUser({
    email: `${TEST_EMAIL_PREFIX}${crypto.randomUUID()}@example.com`,
    ...overrides,
  });

  await db.user.create({
    data: {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      role: raw.role,
      authSubject: raw.authSubject ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    },
  });

  return raw;
}

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.user.deleteMany({ where: { email: { startsWith: TEST_EMAIL_PREFIX } } });
  await db.$disconnect();
});

afterEach(async () => {
  await db.user.deleteMany({ where: { email: { startsWith: TEST_EMAIL_PREFIX } } });
});

describe('PrismaUserRepository', () => {
  describe('findById', () => {
    it('should return the user when found', async () => {
      const seeded = await seedUser();

      const idResult = Id.create(seeded.id);
      if (idResult.isLeft()) throw idResult.value;

      const user = await repo.findById(idResult.value);

      expect(user).not.toBeNull();
      expect(user!.id.value).toBe(seeded.id);
    });

    it('should return null when not found', async () => {
      const idResult = Id.create(crypto.randomUUID());
      if (idResult.isLeft()) throw idResult.value;

      const user = await repo.findById(idResult.value);

      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return the user when found', async () => {
      const seeded = await seedUser();

      const { Email } = await import('@repo/core/shared');
      const emailResult = Email.create(seeded.email);
      if (emailResult.isLeft()) throw emailResult.value;

      const user = await repo.findByEmail(emailResult.value);

      expect(user).not.toBeNull();
      expect(user!.email.value).toBe(seeded.email);
    });

    it('should return null when email does not exist', async () => {
      const { Email } = await import('@repo/core/shared');
      const emailResult = Email.create(`${TEST_EMAIL_PREFIX}nonexistent@example.com`);
      if (emailResult.isLeft()) throw emailResult.value;

      const user = await repo.findByEmail(emailResult.value);

      expect(user).toBeNull();
    });
  });

  describe('findByAuthSubject', () => {
    it('should return the user when authSubject matches', async () => {
      const authSubject = crypto.randomUUID();
      const seeded = await seedUser({ authSubject });

      const idResult = Id.create(authSubject);
      if (idResult.isLeft()) throw idResult.value;

      const user = await repo.findByAuthSubject(idResult.value);

      expect(user).not.toBeNull();
      expect(user!.id.value).toBe(seeded.id);
    });

    it('should return null when authSubject does not exist', async () => {
      const idResult = Id.create(crypto.randomUUID());
      if (idResult.isLeft()) throw idResult.value;

      const user = await repo.findByAuthSubject(idResult.value);

      expect(user).toBeNull();
    });
  });

  describe('linkAuthSubject', () => {
    it('should link authSubject to an existing user', async () => {
      const seeded = await seedUser({ authSubject: null });
      const newAuthSubject = crypto.randomUUID();

      const userIdResult = Id.create(seeded.id);
      const authSubjectResult = Id.create(newAuthSubject);
      if (userIdResult.isLeft()) throw userIdResult.value;
      if (authSubjectResult.isLeft()) throw authSubjectResult.value;

      await repo.linkAuthSubject(userIdResult.value, authSubjectResult.value);

      const updated = await db.user.findUnique({ where: { id: seeded.id } });
      expect(updated!.authSubject).toBe(newAuthSubject);
    });

    it('should throw InfrastructureError when user does not exist', async () => {
      const userIdResult = Id.create(crypto.randomUUID());
      const authSubjectResult = Id.create(crypto.randomUUID());
      if (userIdResult.isLeft()) throw userIdResult.value;
      if (authSubjectResult.isLeft()) throw authSubjectResult.value;

      await expect(
        repo.linkAuthSubject(userIdResult.value, authSubjectResult.value),
      ).rejects.toThrow(InfrastructureError);
    });
  });

  describe('save', () => {
    it('should persist a new user and retrieve it', async () => {
      const raw = buildPrismaUser({
        email: `${TEST_EMAIL_PREFIX}${crypto.randomUUID()}@example.com`,
      });
      const user = UserMapper.toDomain(raw);

      await repo.save(user);

      const found = await db.user.findUnique({ where: { id: raw.id } });
      expect(found).not.toBeNull();
      expect(found!.email).toBe(raw.email);
    });

    it('should update an existing user on upsert', async () => {
      const seeded = await seedUser({ authSubject: null });
      const newAuthSubject = crypto.randomUUID();

      const updatedRaw = buildPrismaUser({ ...seeded, authSubject: newAuthSubject });
      const updatedUser = UserMapper.toDomain(updatedRaw);

      await repo.save(updatedUser);

      const found = await db.user.findUnique({ where: { id: seeded.id } });
      expect(found!.authSubject).toBe(newAuthSubject);
    });
  });
});
