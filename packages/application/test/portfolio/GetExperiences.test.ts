import {
  EmploymentType,
  IExperienceRepository,
  ISkillRepository,
  LocationType,
} from '@repo/core/portfolio';
import { DomainError } from '@repo/core/shared';
import { ExperienceBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ExperienceDTO } from '~/portfolio/dtos/ExperienceDTO';
import { GetExperiences } from '~/portfolio/use-cases/GetExperiences';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SKILL_ID_1 = 'a0000000-0000-4000-8000-000000000001';
const SKILL_ID_2 = 'a0000000-0000-4000-8000-000000000002';

function makeRepository(
  overrides: Partial<IExperienceRepository> = {},
): IExperienceRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

function makeSkillRepository(
  map: Map<string, { name: string; icon: string }> = new Map(),
): ISkillRepository {
  return {
    findNamesByIds: vi.fn().mockResolvedValue(map),
  };
}

/** Every field the DTO maps, set explicitly — for the mapping tests. */
function experienceWithAllFields() {
  return ExperienceBuilder.build()
    .withCompany({ 'pt-BR': 'Empresa Exemplo', 'en-US': 'Example Company' })
    .withPosition({
      'pt-BR': 'Engenheiro de Software',
      'en-US': 'Software Engineer',
    })
    .withLocation({
      'pt-BR': 'São Paulo, Brasil',
      'en-US': 'São Paulo, Brazil',
    })
    .withDescription({
      'pt-BR': 'Descrição do trabalho',
      'en-US': 'Job description',
    })
    .withLogo('https://example.com/logo.png', {
      'pt-BR': 'Logo da empresa',
      'en-US': 'Company logo',
    })
    .withEmploymentType(EmploymentType.FULL_TIME)
    .withLocationType(LocationType.HYBRID)
    .withStartAt('2022-01-01T00:00:00.000Z')
    .withEndAt('2023-01-01T00:00:00.000Z')
    .withSkills([SKILL_ID_1, SKILL_ID_2]);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GetExperiences', () => {
  describe('execute()', () => {
    it('should return Right with empty array when repository returns no experiences', async () => {
      const repo = makeRepository({ findAll: vi.fn().mockResolvedValue([]) });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual([]);
    });

    it('should return Right with mapped DTOs when repository returns experiences', async () => {
      const experience = ExperienceBuilder.build().now();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value as ExperienceDTO[]).toHaveLength(1);
    });

    it('should sort experiences by startAt descending (newest first)', async () => {
      const oldest = ExperienceBuilder.build()
        .withStartAt('2020-01-01T00:00:00.000Z')
        .withEndAt('2021-01-01T00:00:00.000Z')
        .withCompany({ 'en-US': 'oldest', 'pt-BR': 'oldest' })
        .now();
      const middle = ExperienceBuilder.build()
        .withStartAt('2021-06-01T00:00:00.000Z')
        .withEndAt('2022-06-01T00:00:00.000Z')
        .withCompany({ 'en-US': 'middle', 'pt-BR': 'middle' })
        .now();
      const newest = ExperienceBuilder.build()
        .withStartAt('2023-01-01T00:00:00.000Z')
        .withEndAt('2024-01-01T00:00:00.000Z')
        .withCompany({ 'en-US': 'newest', 'pt-BR': 'newest' })
        .now();

      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([oldest, newest, middle]),
      });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dtos = result.value as ExperienceDTO[];
      expect(dtos[0]!.company).toBe('newest');
      expect(dtos[1]!.company).toBe('middle');
      expect(dtos[2]!.company).toBe('oldest');
    });

    it('should not mutate the original array from the repository', async () => {
      const oldest = ExperienceBuilder.build()
        .withStartAt('2020-01-01T00:00:00.000Z')
        .withEndAt('2021-01-01T00:00:00.000Z')
        .now();
      const newest = ExperienceBuilder.build()
        .withStartAt('2023-01-01T00:00:00.000Z')
        .withEndAt('2024-01-01T00:00:00.000Z')
        .now();
      const original = [oldest, newest];

      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue(original),
      });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      await useCase.execute({ locale: 'pt-BR' });

      expect(original[0]!.period.startAt.value).toBe(
        '2020-01-01T00:00:00.000Z',
      );
      expect(original[1]!.period.startAt.value).toBe(
        '2023-01-01T00:00:00.000Z',
      );
    });

    it('should map all DTO fields correctly for pt-BR locale', async () => {
      const experience = experienceWithAllFields().now();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ExperienceDTO[])[0]!;

      expect(dto.id).toBe(experience.id.value);
      expect(dto.company).toBe('Empresa Exemplo');
      expect(dto.position).toBe('Engenheiro de Software');
      expect(dto.location).toBe('São Paulo, Brasil');
      expect(dto.description).toBe('Descrição do trabalho');
      expect(dto.logo).toEqual({
        url: 'https://example.com/logo.png',
        alt: 'Logo da empresa',
      });
      expect(dto.employmentType).toBe('FULL_TIME');
      expect(dto.locationType).toBe('HYBRID');
      expect(dto.startAt).toBe('2022-01-01T00:00:00.000Z');
      expect(dto.endAt).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should map localized fields using the requested locale', async () => {
      const experience = experienceWithAllFields().now();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      const ptResult = await useCase.execute({ locale: 'pt-BR' });
      const enResult = await useCase.execute({ locale: 'en-US' });

      expect(ptResult.isRight()).toBe(true);
      expect(enResult.isRight()).toBe(true);

      const ptDto = (ptResult.value as ExperienceDTO[])[0]!;
      const enDto = (enResult.value as ExperienceDTO[])[0]!;

      expect(ptDto.company).toBe('Empresa Exemplo');
      expect(ptDto.position).toBe('Engenheiro de Software');
      expect(enDto.company).toBe('Example Company');
      expect(enDto.position).toBe('Software Engineer');
    });

    it('should resolve skill names from the skill repository', async () => {
      const experience = ExperienceBuilder.build()
        .withSkills([SKILL_ID_1, SKILL_ID_2])
        .now();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const skillRepo = makeSkillRepository(
        new Map([
          [SKILL_ID_1, { name: 'TypeScript', icon: '' }],
          [SKILL_ID_2, { name: 'React', icon: '' }],
        ]),
      );
      const useCase = new GetExperiences(repo, skillRepo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ExperienceDTO[])[0]!;

      expect(dto.skills).toHaveLength(2);
      expect(dto.skills[0]).toEqual({ name: 'TypeScript', icon: '' });
      expect(dto.skills[1]).toEqual({ name: 'React', icon: '' });
    });

    it('should map skills as empty array when experience has no skills', async () => {
      const experience = ExperienceBuilder.build().withSkills([]).now();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ExperienceDTO[])[0]!;
      expect(dto.skills).toEqual([]);
    });

    it('should include endAt as undefined when experience has no end date', async () => {
      const experience = ExperienceBuilder.build().withoutEndAt().now();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ExperienceDTO[])[0]!;
      expect(dto.endAt).toBeUndefined();
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findAll: vi.fn().mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should call findAll() on the repository', async () => {
      const findAll = vi.fn().mockResolvedValue([]);
      const repo = makeRepository({ findAll });
      const useCase = new GetExperiences(repo, makeSkillRepository());

      await useCase.execute({ locale: 'pt-BR' });

      expect(findAll).toHaveBeenCalledOnce();
    });
  });
});
