import { describe, expect, it, vi } from 'vitest';

import {
  Experience,
  IExperienceProps,
  IExperienceRepository,
} from '@repo/core/portfolio';
import { DomainError } from '@repo/core/shared';

import { ExperienceDTO } from '~/portfolio/dtos/ExperienceDTO';
import { GetExperiences } from '~/portfolio/use-cases/GetExperiences';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SKILL_ID_1 = 'a0000000-0000-4000-8000-000000000001';
const SKILL_ID_2 = 'a0000000-0000-4000-8000-000000000002';

const BASE_PROPS: IExperienceProps = {
  company: { 'pt-BR': 'Empresa Exemplo', 'en-US': 'Example Company' },
  position: { 'pt-BR': 'Engenheiro de Software', 'en-US': 'Software Engineer' },
  location: { 'pt-BR': 'São Paulo, Brasil', 'en-US': 'São Paulo, Brazil' },
  description: { 'pt-BR': 'Descrição do trabalho', 'en-US': 'Job description' },
  logo: {
    url: 'https://example.com/logo.png',
    alt: { 'pt-BR': 'Logo da empresa', 'en-US': 'Company logo' },
  },
  employment_type: 'FULL_TIME',
  location_type: 'HYBRID',
  start_at: '2022-01-01T00:00:00.000Z',
  end_at: '2023-01-01T00:00:00.000Z',
  skills: [SKILL_ID_1, SKILL_ID_2],
};

function makeExperience(overrides: Partial<IExperienceProps> = {}): Experience {
  const result = Experience.create({ ...BASE_PROPS, ...overrides });
  if (result.isLeft())
    throw new Error(`makeExperience failed: ${result.value.message}`);
  return result.value;
}

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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GetExperiences', () => {
  describe('execute()', () => {
    it('should return Right with empty array when repository returns no experiences', async () => {
      const repo = makeRepository({ findAll: vi.fn().mockResolvedValue([]) });
      const useCase = new GetExperiences(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual([]);
    });

    it('should return Right with mapped DTOs when repository returns experiences', async () => {
      const experience = makeExperience();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value as ExperienceDTO[]).toHaveLength(1);
    });

    it('should sort experiences by startAt descending (newest first)', async () => {
      const oldest = makeExperience({
        start_at: '2020-01-01T00:00:00.000Z',
        end_at: '2021-01-01T00:00:00.000Z',
        company: { 'pt-BR': 'oldest' },
      });
      const middle = makeExperience({
        start_at: '2021-06-01T00:00:00.000Z',
        end_at: '2022-06-01T00:00:00.000Z',
        company: { 'pt-BR': 'middle' },
      });
      const newest = makeExperience({
        start_at: '2023-01-01T00:00:00.000Z',
        end_at: '2024-01-01T00:00:00.000Z',
        company: { 'pt-BR': 'newest' },
      });

      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([oldest, newest, middle]),
      });
      const useCase = new GetExperiences(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dtos = result.value as ExperienceDTO[];
      expect(dtos[0]!.company).toBe('newest');
      expect(dtos[1]!.company).toBe('middle');
      expect(dtos[2]!.company).toBe('oldest');
    });

    it('should not mutate the original array from the repository', async () => {
      const oldest = makeExperience({
        start_at: '2020-01-01T00:00:00.000Z',
        end_at: '2021-01-01T00:00:00.000Z',
      });
      const newest = makeExperience({
        start_at: '2023-01-01T00:00:00.000Z',
        end_at: '2024-01-01T00:00:00.000Z',
      });
      const original = [oldest, newest];

      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue(original),
      });
      const useCase = new GetExperiences(repo);

      await useCase.execute({ locale: 'pt-BR' });

      expect(original[0]!.period.startAt.value).toBe(
        '2020-01-01T00:00:00.000Z',
      );
      expect(original[1]!.period.startAt.value).toBe(
        '2023-01-01T00:00:00.000Z',
      );
    });

    it('should map all DTO fields correctly for pt-BR locale', async () => {
      const experience = makeExperience();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo);

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
      const experience = makeExperience();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo);

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

    it('should map skill IDs as strings in the DTO', async () => {
      const experience = makeExperience({
        skills: [SKILL_ID_1, SKILL_ID_2],
      });
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ExperienceDTO[])[0]!;

      expect(dto.skills).toHaveLength(2);
      expect(dto.skills[0]).toBe(SKILL_ID_1);
      expect(dto.skills[1]).toBe(SKILL_ID_2);
    });

    it('should map skills as empty array when experience has no skills', async () => {
      const experience = makeExperience({ skills: [] });
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ExperienceDTO[])[0]!;
      expect(dto.skills).toEqual([]);
    });

    it('should include endAt as undefined when experience has no end date', async () => {
      const experience = makeExperience({ end_at: undefined });
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([experience]),
      });
      const useCase = new GetExperiences(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ExperienceDTO[])[0]!;
      expect(dto.endAt).toBeUndefined();
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findAll: vi.fn().mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new GetExperiences(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should call findAll() on the repository', async () => {
      const findAll = vi.fn().mockResolvedValue([]);
      const repo = makeRepository({ findAll });
      const useCase = new GetExperiences(repo);

      await useCase.execute({ locale: 'pt-BR' });

      expect(findAll).toHaveBeenCalledOnce();
    });
  });
});
