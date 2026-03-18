import { describe, expect, it, vi } from 'vitest';

import {
  IProjectProps,
  IProjectRepository,
  Project,
  ProjectStatus,
} from '@repo/core/portfolio';
import { DomainError, NotFoundError, ValidationError } from '@repo/core/shared';

import { ProjectDetailDTO } from '~/portfolio/dtos/ProjectDetailDTO';
import { GetProjectBySlug } from '~/portfolio/use-cases/GetProjectBySlug';

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

describe('GetProjectBySlug', () => {
  describe('execute()', () => {
    it('should return Right with ProjectDetailDTO when project is found', async () => {
      const project = makeProject();
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(project),
        findRelated: vi.fn().mockResolvedValue([]),
      });
      const useCase = new GetProjectBySlug(repo);

      const result = await useCase.execute({ slug: 'my-project', locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
    });

    it('should map all ProjectDetailDTO fields correctly', async () => {
      const project = makeProject({
        summary: { 'pt-BR': 'Resumo PT', 'en-US': 'Summary EN' },
        objectives: { 'pt-BR': 'Objetivos PT', 'en-US': 'Objectives EN' },
        role: { 'pt-BR': 'Papel PT', 'en-US': 'Role EN' },
        team: 'Team A',
        period: { start: '2023-01-01T00:00:00.000Z', end: '2023-12-31T00:00:00.000Z' },
      });
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(project),
        findRelated: vi.fn().mockResolvedValue([]),
      });
      const useCase = new GetProjectBySlug(repo);

      const result = await useCase.execute({ slug: 'my-project', locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = result.value as ProjectDetailDTO;

      expect(dto.id).toBe(project.id.value);
      expect(dto.slug).toBe('my-project');
      expect(dto.title).toBe('Título do Projeto');
      expect(dto.caption).toBe('Legenda do projeto');
      expect(dto.coverImage.url).toBe('https://example.com/cover.jpg');
      expect(dto.coverImage.alt).toBe('Capa do projeto');
      expect(dto.content).toBe('Conteúdo detalhado do projeto aqui.');
      expect(dto.summary).toBe('Resumo PT');
      expect(dto.objectives).toBe('Objetivos PT');
      expect(dto.role).toBe('Papel PT');
      expect(dto.team).toBe('Team A');
      expect(dto.period.startAt).toBe('2023-01-01T00:00:00.000Z');
      expect(dto.period.endAt).toBe('2023-12-31T00:00:00.000Z');
      expect(dto.relatedProjects).toEqual([]);
    });

    it('should leave optional fields undefined when not set', async () => {
      const project = makeProject();
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(project),
        findRelated: vi.fn().mockResolvedValue([]),
      });
      const useCase = new GetProjectBySlug(repo);

      const result = await useCase.execute({ slug: 'my-project', locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = result.value as ProjectDetailDTO;

      expect(dto.theme).toBeUndefined();
      expect(dto.summary).toBeUndefined();
      expect(dto.objectives).toBeUndefined();
      expect(dto.role).toBeUndefined();
      expect(dto.team).toBeUndefined();
      expect(dto.period.endAt).toBeUndefined();
    });

    it('should use the requested locale for all localized fields', async () => {
      const project = makeProject({
        theme: { 'pt-BR': 'Tema PT', 'en-US': 'Theme EN' },
      });
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(project),
        findRelated: vi.fn().mockResolvedValue([]),
      });
      const useCase = new GetProjectBySlug(repo);

      const enResult = await useCase.execute({ slug: 'my-project', locale: 'en-US' });

      expect(enResult.isRight()).toBe(true);
      const dto = enResult.value as ProjectDetailDTO;
      expect(dto.title).toBe('Project Title');
      expect(dto.caption).toBe('Project caption');
      expect(dto.coverImage.alt).toBe('Project cover');
      expect(dto.theme).toBe('Theme EN');
    });

    it('should include related projects as ProjectSummaryDTO', async () => {
      const project = makeProject();
      const related = makeProject({ slug: 'related-project' });
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(project),
        findRelated: vi.fn().mockResolvedValue([related]),
      });
      const useCase = new GetProjectBySlug(repo);

      const result = await useCase.execute({ slug: 'my-project', locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = result.value as ProjectDetailDTO;
      expect(dto.relatedProjects).toHaveLength(1);
      expect(dto.relatedProjects[0]!.slug).toBe('related-project');
      expect(dto.relatedProjects[0]!.title).toBe('Título do Projeto');
    });

    it('should call findRelated with project id and limit 3', async () => {
      const project = makeProject();
      const findRelated = vi.fn().mockResolvedValue([]);
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(project),
        findRelated,
      });
      const useCase = new GetProjectBySlug(repo);

      await useCase.execute({ slug: 'my-project', locale: 'pt-BR' });

      expect(findRelated).toHaveBeenCalledWith(project.id, 3);
    });

    it('should return Left with NotFoundError when project does not exist', async () => {
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(null),
        findRelated: vi.fn().mockResolvedValue([]),
      });
      const useCase = new GetProjectBySlug(repo);

      const result = await useCase.execute({ slug: 'non-existent', locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('should return Left with ValidationError when slug is invalid', async () => {
      const repo = makeRepository();
      const useCase = new GetProjectBySlug(repo);

      const result = await useCase.execute({ slug: 'ab', locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should not call repository when slug is invalid', async () => {
      const findBySlug = vi.fn();
      const repo = makeRepository({ findBySlug });
      const useCase = new GetProjectBySlug(repo);

      await useCase.execute({ slug: '', locale: 'pt-BR' });

      expect(findBySlug).not.toHaveBeenCalled();
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findBySlug: vi.fn().mockRejectedValue(new Error('DB error')),
      });
      const useCase = new GetProjectBySlug(repo);

      const result = await useCase.execute({ slug: 'my-project', locale: 'pt-BR' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should return Right with empty relatedProjects when findRelated throws', async () => {
      const project = makeProject();
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(project),
        findRelated: vi.fn().mockRejectedValue(new Error('DB error')),
      });
      const useCase = new GetProjectBySlug(repo);

      const result = await useCase.execute({ slug: 'my-project', locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      const dto = result.value as ProjectDetailDTO;
      expect(dto.relatedProjects).toEqual([]);
    });
  });
});
