import { describe, expect, it } from 'vitest';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { ProfileMapper } from '../../../src/repositories/profile/ProfileMapper';
import { buildPrismaProfile } from '../../factories/prisma-profile.factory';

describe('ProfileMapper', () => {
  describe('toDomain', () => {
    it('should map a prisma row to a domain Profile', () => {
      const raw = buildPrismaProfile();

      const profile = ProfileMapper.toDomain(raw);

      expect(profile.id.value).toBe(raw.id);
      expect(profile.name.value).toBe(raw.name);
      expect(profile.headline.value).toEqual(raw.headline);
      expect(profile.bio.value).toEqual(raw.bio);
      expect(profile.photo.url.value).toBe(raw.photoUrl);
      expect(profile.stats).toHaveLength(2);
    });

    it('should order stats by the order field', () => {
      const raw = buildPrismaProfile({
        stats: [
          {
            id: crypto.randomUUID(),
            profileId: crypto.randomUUID(),
            label: { 'en-US': 'B', 'pt-BR': 'B' },
            value: '2',
            icon: 'b-icon',
            order: 1,
          },
          {
            id: crypto.randomUUID(),
            profileId: crypto.randomUUID(),
            label: { 'en-US': 'A', 'pt-BR': 'A' },
            value: '1',
            icon: 'a-icon',
            order: 0,
          },
        ],
      });

      const profile = ProfileMapper.toDomain(raw);

      expect(profile.stats[0]!.label.value).toEqual({ 'en-US': 'A', 'pt-BR': 'A' });
      expect(profile.stats[1]!.label.value).toEqual({ 'en-US': 'B', 'pt-BR': 'B' });
    });

    it('should map empty stats', () => {
      const raw = buildPrismaProfile({ stats: [] });

      const profile = ProfileMapper.toDomain(raw);

      expect(profile.stats).toHaveLength(0);
    });

    it('should throw InfrastructureError when data is invalid', () => {
      const raw = buildPrismaProfile({ name: '' });

      expect(() => ProfileMapper.toDomain(raw)).toThrow(InfrastructureError);
    });
  });

  describe('toPrisma', () => {
    it('should map a domain Profile to prisma data', () => {
      const raw = buildPrismaProfile();
      const profile = ProfileMapper.toDomain(raw);

      const data = ProfileMapper.toPrisma(profile);

      expect(data.id).toBe(raw.id);
      expect(data.name).toBe(raw.name);
      expect(data.photoUrl).toBe(raw.photoUrl);
    });

    it('should serialize stats with order index', () => {
      const raw = buildPrismaProfile();
      const profile = ProfileMapper.toDomain(raw);

      const data = ProfileMapper.toPrisma(profile);

      expect(data.stats).toHaveLength(2);
      expect(data.stats[0]!.order).toBe(0);
      expect(data.stats[1]!.order).toBe(1);
    });
  });
});
