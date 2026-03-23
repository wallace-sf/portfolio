import { PrismaClient } from '@prisma/client';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ProfileMapper } from '../../../src/repositories/profile/ProfileMapper';
import { PrismaProfileRepository } from '../../../src/repositories/profile/PrismaProfileRepository';
import { buildPrismaProfile } from '../../factories/prisma-profile.factory';

// Use DIRECT_URL to bypass PgBouncer — prepared statements don't work with the pooler
const db = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});
const repo = new PrismaProfileRepository(db);

afterEach(async () => {
  await db.profile.deleteMany({});
});

afterAll(async () => {
  await db.$disconnect();
});

describe('PrismaProfileRepository', () => {
  describe('find', () => {
    it('should return null when no profile exists', async () => {
      const profile = await repo.find();
      expect(profile).toBeNull();
    });

    it('should return the profile with stats ordered by order ASC', async () => {
      const raw = buildPrismaProfile();
      await db.profile.create({
        data: {
          id: raw.id,
          name: raw.name,
          headline: raw.headline,
          bio: raw.bio,
          photoUrl: raw.photoUrl,
          photoAlt: raw.photoAlt,
          featuredProjectSlugs: raw.featuredProjectSlugs,
          stats: {
            create: [
              { label: { 'pt-BR': 'B' }, value: '2', icon: 'b-icon', order: 1 },
              { label: { 'pt-BR': 'A' }, value: '1', icon: 'a-icon', order: 0 },
            ],
          },
        },
      });

      const profile = await repo.find();

      expect(profile).not.toBeNull();
      expect(profile!.id.value).toBe(raw.id);
      expect(profile!.stats[0]!.label.value).toEqual({ 'pt-BR': 'A' });
      expect(profile!.stats[1]!.label.value).toEqual({ 'pt-BR': 'B' });
    });

    it('should return the profile with featuredProjectSlugs', async () => {
      const raw = buildPrismaProfile({ stats: [] });
      await db.profile.create({
        data: {
          id: raw.id,
          name: raw.name,
          headline: raw.headline,
          bio: raw.bio,
          photoUrl: raw.photoUrl,
          photoAlt: raw.photoAlt,
          featuredProjectSlugs: ['project-a', 'project-b'],
        },
      });

      const profile = await repo.find();

      expect(profile!.featuredProjectSlugs).toHaveLength(2);
      expect(profile!.featuredProjectSlugs[0]!.value).toBe('project-a');
    });
  });

  describe('save', () => {
    it('should create a new profile', async () => {
      const raw = buildPrismaProfile();
      const profile = ProfileMapper.toDomain(raw);

      await repo.save(profile);

      const found = await repo.find();
      expect(found).not.toBeNull();
      expect(found!.id.value).toBe(raw.id);
      expect(found!.stats).toHaveLength(2);
    });

    it('should update an existing profile on upsert', async () => {
      const raw = buildPrismaProfile();
      const profile = ProfileMapper.toDomain(raw);
      await repo.save(profile);

      const updatedRaw = buildPrismaProfile({
        ...raw,
        name: 'Wallace Updated',
        stats: [
          { id: crypto.randomUUID(), profileId: raw.id, label: { 'pt-BR': 'Novo stat' }, value: '99', icon: 'star', order: 0 },
        ],
      });
      const updated = ProfileMapper.toDomain(updatedRaw);
      await repo.save(updated);

      const found = await repo.find();
      expect(found!.name.value).toBe('Wallace Updated');
      expect(found!.stats).toHaveLength(1);
    });

    it('should replace stats on update', async () => {
      const raw = buildPrismaProfile();
      await repo.save(ProfileMapper.toDomain(raw));

      const updatedRaw = buildPrismaProfile({ ...raw, stats: [] });
      await repo.save(ProfileMapper.toDomain(updatedRaw));

      const found = await repo.find();
      expect(found!.stats).toHaveLength(0);
    });
  });
});
