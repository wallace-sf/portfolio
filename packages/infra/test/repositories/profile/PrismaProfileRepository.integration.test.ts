import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { PrismaProfileRepository } from '../../../src/repositories/profile/PrismaProfileRepository';
import { ProfileMapper } from '../../../src/repositories/profile/ProfileMapper';
import {
  buildPrismaProfile,
  buildPrismaProfileCreateInput,
} from '../../factories/prisma-profile.factory';
import { withRollback } from '../../support/withRollback';

// Use DIRECT_URL to bypass PgBouncer — prepared statements don't work with the pooler
const db = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

// Skipped as a whole (hooks included) when there is no reachable database —
// a fresh clone or a paused dev project must not fail the @repo/infra suite.
// Run explicitly with `pnpm --filter @repo/infra test:integration`.
const missingDbEnv = !process.env.DIRECT_URL;

type Ctx = { tx: PrismaClient; repo: PrismaProfileRepository };

/**
 * Runs a test with no profile row inside a rolled-back transaction: the
 * profile is a singleton (`find()` reads the first row), so the dev profile
 * is hidden from the test, never deleted.
 */
function withoutProfile(fn: (ctx: Ctx) => Promise<void>) {
  return () =>
    withRollback(db, async (tx) => {
      await tx.profile.deleteMany({});
      await fn({ tx, repo: new PrismaProfileRepository(tx) });
    });
}

beforeAll(async () => {
  if (missingDbEnv) return;
  await db.$connect();
});

afterAll(async () => {
  if (missingDbEnv) return;
  await db.$disconnect();
});

describe.skipIf(missingDbEnv)('PrismaProfileRepository (integration)', () => {
  describe('find', () => {
    it(
      'should return null when no profile exists',
      withoutProfile(async ({ repo }) => {
        const profile = await repo.find();
        expect(profile).toBeNull();
      }),
    );

    it(
      'should return the profile with stats ordered by order ASC',
      withoutProfile(async ({ tx, repo }) => {
        const data = {
          ...buildPrismaProfileCreateInput(),
          stats: {
            create: [
              {
                label: { 'en-US': 'B', 'pt-BR': 'B' },
                value: '2',
                icon: 'b-icon',
                order: 1,
              },
              {
                label: { 'en-US': 'A', 'pt-BR': 'A' },
                value: '1',
                icon: 'a-icon',
                order: 0,
              },
            ],
          },
        };
        await tx.profile.create({ data });

        const profile = await repo.find();

        expect(profile).not.toBeNull();
        expect(profile!.id.value).toBe(data.id);
        expect(profile!.stats[0]!.label.value).toEqual({
          'en-US': 'A',
          'pt-BR': 'A',
        });
        expect(profile!.stats[1]!.label.value).toEqual({
          'en-US': 'B',
          'pt-BR': 'B',
        });
      }),
    );
  });

  describe('save', () => {
    it(
      'should create a new profile',
      withoutProfile(async ({ repo }) => {
        const raw = buildPrismaProfile();
        const profile = ProfileMapper.toDomain(raw);

        await repo.save(profile);

        const found = await repo.find();
        expect(found).not.toBeNull();
        expect(found!.id.value).toBe(raw.id);
        expect(found!.stats).toHaveLength(2);
      }),
    );

    it(
      'should update an existing profile on upsert',
      withoutProfile(async ({ repo }) => {
        const raw = buildPrismaProfile();
        const profile = ProfileMapper.toDomain(raw);
        await repo.save(profile);

        const updatedRaw = buildPrismaProfile({
          ...raw,
          name: 'Wallace Updated',
          stats: [
            {
              id: crypto.randomUUID(),
              profileId: raw.id,
              label: { 'en-US': 'New stat', 'pt-BR': 'Novo stat' },
              value: '99',
              icon: 'star',
              order: 0,
            },
          ],
        });
        const updated = ProfileMapper.toDomain(updatedRaw);
        await repo.save(updated);

        const found = await repo.find();
        expect(found!.name.value).toBe('Wallace Updated');
        expect(found!.stats).toHaveLength(1);
      }),
    );

    it(
      'should replace stats on update',
      withoutProfile(async ({ repo }) => {
        const raw = buildPrismaProfile();
        await repo.save(ProfileMapper.toDomain(raw));

        const updatedRaw = buildPrismaProfile({ ...raw, stats: [] });
        await repo.save(ProfileMapper.toDomain(updatedRaw));

        const found = await repo.find();
        expect(found!.stats).toHaveLength(0);
      }),
    );
  });
});
