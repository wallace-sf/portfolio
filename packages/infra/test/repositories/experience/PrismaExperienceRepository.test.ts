import { PrismaClient } from '@prisma/client';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { LocationType } from '@repo/core/portfolio';
import { Id } from '@repo/core/shared';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { ExperienceMapper } from '../../../src/repositories/experience/ExperienceMapper';
import { PrismaExperienceRepository } from '../../../src/repositories/experience/PrismaExperienceRepository';
import { buildPrismaExperience } from '../../factories/prisma-experience.factory';

// Use DIRECT_URL to bypass PgBouncer — prepared statements don't work with the pooler
const db = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});
const repo = new PrismaExperienceRepository(db);

async function seedExperience(
  overrides?: Partial<ReturnType<typeof buildPrismaExperience>>,
) {
  const raw = buildPrismaExperience(overrides);

  await db.experience.create({
    data: {
      id: raw.id,
      company: raw.company,
      position: raw.position,
      location: raw.location,
      description: raw.description,
      logoUrl: raw.logoUrl,
      logoAlt: raw.logoAlt,
      employmentType: raw.employmentType,
      locationType: raw.locationType,
      skillIds: raw.skillIds,
      startAt: raw.startAt,
      endAt: raw.endAt,
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
  await db.$disconnect();
});

afterEach(async () => {
  await db.experience.deleteMany({});
});

describe('PrismaExperienceRepository', () => {
  describe('findAll', () => {
    it('should return all experiences ordered by startAt desc', async () => {
      await seedExperience({ startAt: new Date('2022-01-01') });
      await seedExperience({ startAt: new Date('2024-01-01') });

      const experiences = await repo.findAll();

      expect(experiences).toHaveLength(2);
      expect(experiences[0]!.period.startAt.value).toContain('2024');
      expect(experiences[1]!.period.startAt.value).toContain('2022');
    });

    it('should return empty array when no experiences exist', async () => {
      const experiences = await repo.findAll();
      expect(experiences).toHaveLength(0);
    });

    it('should include skill IDs', async () => {
      const skillId = crypto.randomUUID();
      await seedExperience({ skillIds: [skillId] });

      const experiences = await repo.findAll();

      expect(experiences[0]!.skills).toHaveLength(1);
      expect(experiences[0]!.skills[0]!.value).toBe(skillId);
    });
  });

  describe('findById', () => {
    it('should return the experience when found', async () => {
      const seeded = await seedExperience();

      const idResult = Id.create(seeded.id);
      if (idResult.isLeft()) throw idResult.value;

      const experience = await repo.findById(idResult.value);

      expect(experience).not.toBeNull();
      expect(experience!.id.value).toBe(seeded.id);
    });

    it('should return null when not found', async () => {
      const idResult = Id.create(crypto.randomUUID());
      if (idResult.isLeft()) throw idResult.value;

      const experience = await repo.findById(idResult.value);

      expect(experience).toBeNull();
    });
  });

  describe('save', () => {
    it('should persist a new experience and retrieve it', async () => {
      const skillId = crypto.randomUUID();
      const raw = buildPrismaExperience({ skillIds: [skillId] });
      const experience = ExperienceMapper.toDomain(raw);

      await repo.save(experience);

      const idResult = Id.create(raw.id);
      if (idResult.isLeft()) throw idResult.value;
      const found = await repo.findById(idResult.value);

      expect(found).not.toBeNull();
      expect(found!.id.value).toBe(raw.id);
      expect(found!.skills).toHaveLength(1);
      expect(found!.skills[0]!.value).toBe(skillId);
    });

    it('should update an existing experience on upsert', async () => {
      const seeded = await seedExperience({ locationType: 'REMOTE' });

      const idResult = Id.create(seeded.id);
      if (idResult.isLeft()) throw idResult.value;

      const updatedRaw = buildPrismaExperience({ ...seeded, locationType: 'HYBRID' });
      const updated = ExperienceMapper.toDomain(updatedRaw);

      await repo.save(updated);

      const found = await repo.findById(idResult.value);
      expect(found!.location_type).toBe(LocationType.HYBRID);
    });
  });

  describe('delete', () => {
    it('should hard-delete an experience', async () => {
      const seeded = await seedExperience();

      const idResult = Id.create(seeded.id);
      if (idResult.isLeft()) throw idResult.value;

      await repo.delete(idResult.value);

      const found = await repo.findById(idResult.value);
      expect(found).toBeNull();
    });

    it('should throw InfrastructureError when experience does not exist', async () => {
      const idResult = Id.create(crypto.randomUUID());
      if (idResult.isLeft()) throw idResult.value;

      await expect(repo.delete(idResult.value)).rejects.toThrow(InfrastructureError);
    });
  });
});
