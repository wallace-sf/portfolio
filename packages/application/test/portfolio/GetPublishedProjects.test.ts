import {
  IProjectRepository,
  ISkillRepository,
  ProjectStatus,
} from '@repo/core/portfolio';
import { DomainError } from '@repo/core/shared';
import { ProjectBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ProjectSummaryDTO } from '~/portfolio/dtos/ProjectSummaryDTO';
import { GetPublishedProjects } from '~/portfolio/use-cases/GetPublishedProjects';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRepository(
  overrides: Partial<IProjectRepository> = {},
): IProjectRepository {
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

function makeSkillRepository(
  map: Map<string, { name: string; icon: string }> = new Map(),
): ISkillRepository {
  return {
    findNamesByIds: vi.fn().mockResolvedValue(map),
  };
}

/** Every field the DTO maps, set explicitly — for the mapping tests. */
function projectWithAllFields() {
  return ProjectBuilder.build()
    .withSlug('my-project')
    .withCoverImage({
      url: 'https://example.com/cover.jpg',
      alt: { 'pt-BR': 'Capa do projeto', 'en-US': 'Project cover' },
    })
    .withThumbnailImage({
      url: 'https://example.com/thumbnail.webp',
      alt: { 'pt-BR': 'Thumbnail do projeto', 'en-US': 'Project thumbnail' },
    })
    .withTitle({ 'pt-BR': 'Título do Projeto', 'en-US': 'Project Title' })
    .withCaption({ 'pt-BR': 'Legenda do projeto', 'en-US': 'Project caption' })
    .withContent({
      'en-US': 'Detailed project content here.',
      'pt-BR': 'Conteúdo detalhado do projeto aqui.',
    })
    .withSkills([])
    .withPeriod({ start: '2023-01-01T00:00:00.000Z' })
    .withFeatured(false)
    .withStatus(ProjectStatus.PUBLISHED);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GetPublishedProjects', () => {
  describe('execute()', () => {
    it('should return Right with empty array when repository returns no projects', async () => {
      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([]),
      });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual([]);
    });

    it('should return Right with mapped DTOs when repository returns projects', async () => {
      const project = ProjectBuilder.build().now();
      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([project]),
      });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      expect(result.value as ProjectSummaryDTO[]).toHaveLength(1);
    });

    it('should preserve the order returned by the repository', async () => {
      const first = ProjectBuilder.build().withSlug('first').now();
      const second = ProjectBuilder.build().withSlug('second').now();
      const third = ProjectBuilder.build().withSlug('third').now();

      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([first, second, third]),
      });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dtos = result.value as ProjectSummaryDTO[];
      expect(dtos[0]!.slug).toBe('first');
      expect(dtos[1]!.slug).toBe('second');
      expect(dtos[2]!.slug).toBe('third');
    });

    it('should map all DTO fields correctly for pt-BR locale', async () => {
      const project = projectWithAllFields().now();
      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([project]),
      });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ProjectSummaryDTO[])[0]!;

      expect(dto.id).toBe(project.id.value);
      expect(dto.slug).toBe('my-project');
      expect(dto.title).toBe('Título do Projeto');
      expect(dto.caption).toBe('Legenda do projeto');
      expect(dto.coverImage.url).toBe('https://example.com/cover.jpg');
      expect(dto.coverImage.alt).toBe('Capa do projeto');
      expect(dto.thumbnailImage.url).toBe('https://example.com/thumbnail.webp');
      expect(dto.thumbnailImage.alt).toBe('Thumbnail do projeto');
      expect(dto.theme).toBeUndefined();
      expect(dto.skills).toEqual([]);
      expect(dto.publishedAt).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should map localized fields using the requested locale', async () => {
      const project = projectWithAllFields()
        .withTheme({ 'pt-BR': 'Tema PT', 'en-US': 'Theme EN' })
        .now();
      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([project]),
      });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

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

    it('should include resolved skill names in DTO', async () => {
      const skillId1 = 'a0000000-0000-4000-8000-000000000001';
      const skillId2 = 'a0000000-0000-4000-8000-000000000002';
      const project = ProjectBuilder.build()
        .withSkills([skillId1, skillId2])
        .now();
      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([project]),
      });
      const skillRepo = makeSkillRepository(
        new Map([
          [skillId1, { name: 'TypeScript', icon: '' }],
          [skillId2, { name: 'React', icon: '' }],
        ]),
      );
      const useCase = new GetPublishedProjects(repo, skillRepo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ProjectSummaryDTO[])[0]!;
      expect(dto.skills).toEqual([
        { name: 'TypeScript', icon: '' },
        { name: 'React', icon: '' },
      ]);
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findPublished: vi
          .fn()
          .mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should map repositoryUrl when project is public', async () => {
      const project = ProjectBuilder.build()
        .withRepositoryUrl('https://github.com/user/repo')
        .now();
      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([project]),
      });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'en-US' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ProjectSummaryDTO[])[0]!;
      expect(dto.repositoryUrl).toBe('https://github.com/user/repo');
    });

    it('should omit repositoryUrl when project has no repository', async () => {
      const project = ProjectBuilder.build().now();
      const repo = makeRepository({
        findPublished: vi.fn().mockResolvedValue([project]),
      });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

      const result = await useCase.execute({ locale: 'en-US' });

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ProjectSummaryDTO[])[0]!;
      expect(dto.repositoryUrl).toBeUndefined();
    });

    it('should call findPublished() on the repository', async () => {
      const findPublished = vi.fn().mockResolvedValue([]);
      const repo = makeRepository({ findPublished });
      const useCase = new GetPublishedProjects(repo, makeSkillRepository());

      await useCase.execute({ locale: 'pt-BR' });

      expect(findPublished).toHaveBeenCalledOnce();
    });
  });
});
