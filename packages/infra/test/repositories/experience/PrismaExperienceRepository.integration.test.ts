import { PrismaClient } from '@prisma/client';
import { LocationType } from '@repo/core/portfolio';
import { Id } from '@repo/core/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { ExperienceMapper } from '../../../src/repositories/experience/ExperienceMapper';
import { PrismaExperienceRepository } from '../../../src/repositories/experience/PrismaExperienceRepository';
import {
  buildPrismaExperience,
  buildPrismaExperienceCreateInput,
  PrismaExperience,
} from '../../factories/prisma-experience.factory';
import { withRollback } from '../../support/withRollback';

// Use DIRECT_URL to bypass PgBouncer — prepared statements don't work with the pooler
const db = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

// Skipped as a whole (hooks included) when there is no reachable database —
// a fresh clone or a paused dev project must not fail the @repo/infra suite.
// Run explicitly with `pnpm --filter @repo/infra test:integration`.
const missingDbEnv = !process.env.DIRECT_URL;

/** Persists a factory experience inside the test's transaction. */
function seedExperience(
  tx: PrismaClient,
  overrides?: Partial<PrismaExperience>,
) {
  return tx.experience.create({
    data: buildPrismaExperienceCreateInput(overrides),
  });
}

function idOf(raw: string): Id {
  const result = Id.create(raw);
  if (result.isLeft()) throw result.value;
  return result.value;
}

type Ctx = { tx: PrismaClient; repo: PrismaExperienceRepository };

/**
 * Runs a test against an empty `Experience` table inside a rolled-back
 * transaction: the dev experiences are hidden from the test, never deleted.
 */
function inEmptyTable(fn: (ctx: Ctx) => Promise<void>) {
  return () =>
    withRollback(db, async (tx) => {
      await tx.experience.deleteMany({});
      await fn({ tx, repo: new PrismaExperienceRepository(tx) });
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

describe.skipIf(missingDbEnv)(
  'PrismaExperienceRepository (integration)',
  () => {
    describe('findAll', () => {
      it(
        'should return all experiences ordered by startAt desc',
        inEmptyTable(async ({ tx, repo }) => {
          await seedExperience(tx, { startAt: new Date('2022-01-01') });
          await seedExperience(tx, { startAt: new Date('2024-01-01') });

          const experiences = await repo.findAll();

          expect(experiences).toHaveLength(2);
          expect(experiences[0]!.period.startAt.value).toContain('2024');
          expect(experiences[1]!.period.startAt.value).toContain('2022');
        }),
      );

      it(
        'should return empty array when no experiences exist',
        inEmptyTable(async ({ repo }) => {
          const experiences = await repo.findAll();
          expect(experiences).toHaveLength(0);
        }),
      );

      it(
        'should include skill IDs',
        inEmptyTable(async ({ tx, repo }) => {
          const skillId = crypto.randomUUID();
          await seedExperience(tx, { skillIds: [skillId] });

          const experiences = await repo.findAll();

          expect(experiences[0]!.skills).toHaveLength(1);
          expect(experiences[0]!.skills[0]!.value).toBe(skillId);
        }),
      );
    });

    describe('findById', () => {
      it(
        'should return the experience when found',
        inEmptyTable(async ({ tx, repo }) => {
          const seeded = await seedExperience(tx);

          const experience = await repo.findById(idOf(seeded.id));

          expect(experience).not.toBeNull();
          expect(experience!.id.value).toBe(seeded.id);
        }),
      );

      it(
        'should return null when not found',
        inEmptyTable(async ({ repo }) => {
          const experience = await repo.findById(idOf(crypto.randomUUID()));

          expect(experience).toBeNull();
        }),
      );
    });

    describe('save', () => {
      it(
        'should persist a new experience and retrieve it',
        inEmptyTable(async ({ repo }) => {
          const skillId = crypto.randomUUID();
          const raw = buildPrismaExperience({ skillIds: [skillId] });

          await repo.save(ExperienceMapper.toDomain(raw));

          const found = await repo.findById(idOf(raw.id));
          expect(found).not.toBeNull();
          expect(found!.id.value).toBe(raw.id);
          expect(found!.skills).toHaveLength(1);
          expect(found!.skills[0]!.value).toBe(skillId);
        }),
      );

      it(
        'should update an existing experience on upsert',
        inEmptyTable(async ({ tx, repo }) => {
          const seeded = await seedExperience(tx, { locationType: 'REMOTE' });

          const updatedRaw = buildPrismaExperience({
            ...seeded,
            locationType: 'HYBRID',
          });
          await repo.save(ExperienceMapper.toDomain(updatedRaw));

          const found = await repo.findById(idOf(seeded.id));
          expect(found!.location_type).toBe(LocationType.HYBRID);
        }),
      );
    });

    describe('delete', () => {
      it(
        'should hard-delete an experience',
        inEmptyTable(async ({ tx, repo }) => {
          const seeded = await seedExperience(tx);

          await repo.delete(idOf(seeded.id));

          const found = await repo.findById(idOf(seeded.id));
          expect(found).toBeNull();
        }),
      );

      it(
        'should throw InfrastructureError when experience does not exist',
        inEmptyTable(async ({ repo }) => {
          await expect(repo.delete(idOf(crypto.randomUUID()))).rejects.toThrow(
            InfrastructureError,
          );
        }),
      );
    });
  },
);
