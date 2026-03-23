import { describe, expect, it } from 'vitest';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { ExperienceMapper } from '../../../src/repositories/experience/ExperienceMapper';
import { buildPrismaExperience } from '../../factories/prisma-experience.factory';

describe('ExperienceMapper', () => {
  describe('toDomain', () => {
    it('should map a prisma row to a domain Experience', () => {
      const raw = buildPrismaExperience();

      const experience = ExperienceMapper.toDomain(raw);

      expect(experience.id.value).toBe(raw.id);
      expect(experience.company.value).toEqual(raw.company);
      expect(experience.position.value).toEqual(raw.position);
      expect(experience.location.value).toEqual(raw.location);
      expect(experience.description.value).toEqual(raw.description);
      expect(experience.logo.url.value).toBe(raw.logoUrl);
      expect(experience.employment_type.value).toBe('FULL_TIME');
      expect(experience.location_type.value).toBe('REMOTE');
      expect(experience.skills).toHaveLength(1);
    });

    it('should convert locationType ONSITE to domain ON-SITE', () => {
      const raw = buildPrismaExperience({ locationType: 'ONSITE' });

      const experience = ExperienceMapper.toDomain(raw);

      expect(experience.location_type.value).toBe('ON-SITE');
    });

    it('should convert locationType HYBRID correctly', () => {
      const raw = buildPrismaExperience({ locationType: 'HYBRID' });

      const experience = ExperienceMapper.toDomain(raw);

      expect(experience.location_type.value).toBe('HYBRID');
    });

    it('should map experienceSkill with nested skill and workDescription', () => {
      const raw = buildPrismaExperience();

      const experience = ExperienceMapper.toDomain(raw);
      const skill = experience.skills[0]!;

      expect(skill.skill.id.value).toBe(raw.skills[0]!.skillId);
      expect(skill.workDescription.value).toEqual(raw.skills[0]!.workDescription);
    });

    it('should map endAt when present', () => {
      const end = new Date('2024-12-31T00:00:00.000Z');
      const raw = buildPrismaExperience({ endAt: end });

      const experience = ExperienceMapper.toDomain(raw);

      expect(experience.period.endAt?.value).toBe('2024-12-31T00:00:00.000Z');
    });

    it('should leave period open when endAt is null', () => {
      const raw = buildPrismaExperience({ endAt: null });

      const experience = ExperienceMapper.toDomain(raw);

      expect(experience.period.endAt).toBeUndefined();
    });

    it('should throw InfrastructureError when raw data is invalid', () => {
      const raw = buildPrismaExperience({ logoUrl: '' });

      expect(() => ExperienceMapper.toDomain(raw)).toThrow(InfrastructureError);
    });
  });

  describe('toPrisma', () => {
    it('should map a domain Experience to prisma scalar data', () => {
      const raw = buildPrismaExperience();
      const experience = ExperienceMapper.toDomain(raw);

      const data = ExperienceMapper.toPrisma(experience);

      expect(data.id).toBe(raw.id);
      expect(data.logoUrl).toBe(raw.logoUrl);
      expect(data.employmentType).toBe('FULL_TIME');
      expect(data.locationType).toBe('REMOTE');
    });

    it('should convert domain ON-SITE back to prisma ONSITE', () => {
      const raw = buildPrismaExperience({ locationType: 'ONSITE' });
      const experience = ExperienceMapper.toDomain(raw);

      const data = ExperienceMapper.toPrisma(experience);

      expect(data.locationType).toBe('ONSITE');
    });

    it('should set endAt to null when period has no end', () => {
      const raw = buildPrismaExperience({ endAt: null });
      const experience = ExperienceMapper.toDomain(raw);

      const data = ExperienceMapper.toPrisma(experience);

      expect(data.endAt).toBeNull();
    });

    it('should include endAt as Date when present', () => {
      const end = new Date('2024-12-31T00:00:00.000Z');
      const raw = buildPrismaExperience({ endAt: end });
      const experience = ExperienceMapper.toDomain(raw);

      const data = ExperienceMapper.toPrisma(experience);

      expect(data.endAt).toEqual(end);
    });
  });
});
