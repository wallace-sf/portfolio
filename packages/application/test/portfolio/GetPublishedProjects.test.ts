import { describe, expect, it, vi } from 'vitest';

import {
  IProjectProps,
  IProjectRepository,
  Project,
  ProjectStatus,
  SkillType,
} from '@repo/core/portfolio';
import { DomainError } from '@repo/core/shared';

import { ProjectSummaryDTO } from '~/portfolio/dtos/ProjectSummaryDTO';
import { GetPublishedProjects } from '~/portfolio/use-cases/GetPublishedProjects';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_PROPS: IProjectProps = {
  slug: 'my-project',
  coverImage: {
    url: 'https://example.com/cover.jpg',
    alt: { 'pt-BR': 'Capa do projeto', 'en-US': 'Project cover' },
  },
  title: { 'pt-BR': 'Título do Projeto', 'en-US': 'Project Title' },
  caption: { 'pt-BR': 'Legenda do projeto', 'en-US': 'Project caption' },
  content: 'Conteúdo detalhado do projeto aqui.',
  skills: [],
  period: { start: '2023-01-01T00:00:00.000Z' },
  featured: false,
  status: ProjectStatus.PUBLISHED,
};

function makeProject(overrides: Partial<IProjectProps> = {}): Project {
  const result = Project.create({ ...BASE_PROPS, ...overrides });
  if (result.isLeft()) throw new Error(`makeProject failed: ${result.value.message}`);
  return result.value;
}

function makeRepository(overrides: Partial<IProjectRepository> = {}): IProjectRepository {
  return {
    findAll: vi.fn(),
    findPublished: vi.fn(),
    findFeatured: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    findRelated: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GetPublishedProjects', () => {
  describe('execute()', () => {
    it('should return Right with empty array when repository returns no projects', async () => {
      const repo = makeRepository({ findPublished: vi.fn().mockResolvedValue([]) });
      const useCase = new GetPublishedProjects(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual([]);
    });

    it('should return Right with mapped DTOs when repository returns projects', async () => {
      const project = makeProject();
      const repo = makeRepository({ findPublished: vi.fn().mockResolvedValue([project]) });
      const useCase = new GetPublishedProjects(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value as ProjectSummaryDTO[]).toHaveLength(1);
    });

    it('should sort projects by publishedAt descending (newest first)', async () => {
      const oldest = makeProject({ slug: 'oldest', period: { start: '2021-01-01T00:00:00.000Z' } });
      const middle = makeProject({ slug: 'middle', period: { start: '2022-06-01T00:00:00.000Z' } });
      const newest = makeProject({ slug: 'newest', period: { start: '2023-12-01T00:00:00.000Z' } });

      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([oldest, newest, middle]),
      });
      const useCase = new GetPublishedProjects(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dtos = result.value as ProjectSummaryDTO[];
      expect(dtos[0]!.slug).toBe('newest');
      expect(dtos[1]!.slug).toBe('middle');
      expect(dtos[2]!.slug).toBe('oldest');
    });

    it('should not mutate the original array from the repository', async () => {
      const oldest = makeProject({ slug: 'oldest', period: { start: '2021-01-01T00:00:00.000Z' } });
      const newest = makeProject({ slug: 'newest', period: { start: '2023-01-01T00:00:00.000Z' } });
      const original = [oldest, newest];

      const repo = makeRepository({ findPublished: vi.fn().mockResolvedValue(original) });
      const useCase = new GetPublishedProjects(repo);

      await useCase.execute({ locale: 'pt-BR' });

      expect(original[0]!.slug.value).toBe('oldest');
      expect(original[1]!.slug.value).toBe('newest');
    });

    it('should map all DTO fields correctly for pt-BR locale', async () => {
      const project = makeProject();
      const repo = makeRepository({ findPublished: vi.fn().mockResolvedValue([project]) });
      const useCase = new GetPublishedProjects(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ProjectSummaryDTO[])[0]!;

      expect(dto.id).toBe(project.id.value);
      expect(dto.slug).toBe('my-project');
      expect(dto.title).toBe('Título do Projeto');
      expect(dto.caption).toBe('Legenda do projeto');
      expect(dto.coverImage.url).toBe('https://example.com/cover.jpg');
      expect(dto.coverImage.alt).toBe('Capa do projeto');
      expect(dto.theme).toBeUndefined();
      expect(dto.skills).toEqual([]);
      expect(dto.publishedAt).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should map localized fields using the requested locale', async () => {
      const project = makeProject({
        theme: { 'pt-BR': 'Tema PT', 'en-US': 'Theme EN' },
      });
      const repo = makeRepository({ findPublished: vi.fn().mockResolvedValue([project]) });
      const useCase = new GetPublishedProjects(repo);

      const ptResult = await useCase.execute({ locale: 'pt-BR' });
      const enResult = await useCase.execute({ locale: 'en-US' });

      expect(ptResult.isRight()).toBe(true);
      expect(enResult.isRight()).toBe(true);

      const ptDto = (ptResult.value as ProjectSummaryDTO[])[0]!;
      const enDto = (enResult.value as ProjectSummaryDTO[])[0]!;

      expect(ptDto.title).toBe('Título do Projeto');
      expect(ptDto.theme).toBe('Tema PT');
      expect(enDto.title).toBe('Project Title');
      expect(enDto.theme).toBe('Theme EN');
    });

    it('should include mapped skills descriptions in DTO', async () => {
      const project = makeProject({
        skills: [
          { description: 'TypeScript', icon: 'ts', type: SkillType.TECHNOLOGY },
          { description: 'Next.js', icon: 'next', type: SkillType.TECHNOLOGY },
        ],
      });
      const repo = makeRepository({ findPublished: vi.fn().mockResolvedValue([project]) });
      const useCase = new GetPublishedProjects(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ProjectSummaryDTO[])[0]!;
      expect(dto.skills).toEqual(['TypeScript', 'Next.js']);
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findPublished: vi.fn().mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new GetPublishedProjects(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should call findPublished() on the repository', async () => {
      const findPublished = vi.fn().mockResolvedValue([]);
      const repo = makeRepository({ findPublished });
      const useCase = new GetPublishedProjects(repo);

      await useCase.execute({ locale: 'pt-BR' });

      expect(findPublished).toHaveBeenCalledOnce();
    });
  });
});
