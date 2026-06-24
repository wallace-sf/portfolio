import {
  Id,
  ILocalizedTextInput,
  LocalizedText,
  Project,
  ProjectStatus,
  Slug,
  Url,
  ValidationError,
} from '~/index';

import { ProjectBuilder } from '../helpers';

describe('Project', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid Project', () => {
      const result = Project.create(ProjectBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Project);
    });

    it('should create project with all required fields as VOs', () => {
      const title = { 'pt-BR': 'Meu Projeto', 'en-US': 'My Project' };
      const caption = {
        'en-US': 'A caption for the project.',
        'pt-BR': 'Uma legenda para o projeto.',
      };
      const content: ILocalizedTextInput = {
        'en-US': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'pt-BR': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      };
      const skills = [
        'a0000000-0000-4000-8000-000000000001',
        'a0000000-0000-4000-8000-000000000002',
      ];

      const result = Project.create(
        ProjectBuilder.build()
          .withTitle(title)
          .withCaption(caption)
          .withContent(content)
          .withSkills(skills)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.title.get('pt-BR')).toBe(title['pt-BR']);
      expect(result.value.title.get('en-US')).toBe(title['en-US']);
      expect(result.value.caption.get('pt-BR')).toBe(caption['pt-BR']);
      expect(result.value.content.get('en-US')).toBe(content['en-US']);
      expect(result.value.skills).toHaveLength(2);
      expect(result.value.skills[0]).toBeInstanceOf(Id);
    });

    it('should create project with slug and coverImage', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withSlug('fieldlink-form-builder')
          .withCoverImage({
            url: 'https://example.com/cover.png',
            alt: { 'en-US': 'Cover image', 'pt-BR': 'Imagem de capa' },
          })
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.slug).toBeInstanceOf(Slug);
      expect(result.value.slug.toPath()).toBe('/fieldlink-form-builder');
      expect(result.value.coverImage.url.value).toBe(
        'https://example.com/cover.png',
      );
    });

    it('should create project with thumbnailImage', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withThumbnailImage({
            url: 'https://example.com/thumbnail.webp',
            alt: { 'en-US': 'Thumbnail', 'pt-BR': 'Thumbnail' },
          })
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.thumbnailImage.url.value).toBe(
        'https://example.com/thumbnail.webp',
      );
    });

    it('should create project with period and status', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withPeriod({ start: '2023-01-01', end: '2023-12-31' })
          .withStatus(ProjectStatus.PUBLISHED)
          .withFeatured(true)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.period.isActive()).toBe(false);
      expect(result.value.status).toBe(ProjectStatus.PUBLISHED);
      expect(result.value.featured).toBe(true);
    });

    it('should create project with optional fields', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withTheme({ 'en-US': 'Design System', 'pt-BR': 'Design System' })
          .withSummary({
            'en-US': 'Project summary.',
            'pt-BR': 'Resumo do projeto.',
          })
          .withObjectives({
            'en-US': 'Project objective.',
            'pt-BR': 'Objetivo do projeto.',
          })
          .withRole({ 'en-US': 'Tech Lead', 'pt-BR': 'Tech Lead' })
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.theme?.get('pt-BR')).toBe('Design System');
      expect(result.value.summary?.get('pt-BR')).toBe('Resumo do projeto.');
      expect(result.value.objectives?.get('pt-BR')).toBe(
        'Objetivo do projeto.',
      );
      expect(result.value.role?.get('pt-BR')).toBe('Tech Lead');
    });

    it('should create project with related projects', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withRelatedProjects(['related-project-one', 'related-project-two'])
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.relatedProjects).toHaveLength(2);
      expect(result.value.relatedProjects[0]).toBeInstanceOf(Slug);
    });

    it('should allow projects without skills when the list is empty', () => {
      const result = Project.create(
        ProjectBuilder.build().withSkills([]).toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.skills).toHaveLength(0);
    });

    it('should treat undefined skills as an empty list', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutSkills().toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.skills).toHaveLength(0);
    });

    it('should treat undefined relatedProjects as an empty list', () => {
      const props = ProjectBuilder.build().toProps();
      const result = Project.create({
        ...props,
        relatedProjects: undefined,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.relatedProjects).toHaveLength(0);
    });

    it('should have undefined optional fields when not provided', () => {
      const result = Project.create(ProjectBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.theme).toBeUndefined();
      expect(result.value.summary).toBeUndefined();
      expect(result.value.objectives).toBeUndefined();
      expect(result.value.role).toBeUndefined();
      expect(result.value.repositoryUrl).toBeUndefined();
    });

    it('should create project with repositoryUrl as a Url VO when provided', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withRepositoryUrl('https://github.com/wallace-sf/portfolio')
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.repositoryUrl).toBeInstanceOf(Url);
      expect(result.value.repositoryUrl?.value).toBe(
        'https://github.com/wallace-sf/portfolio',
      );
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when slug is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutSlug().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
    });

    it('should return Left when title is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutTitle().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when caption is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutCaption().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when content is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutContent().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(LocalizedText.ERROR_CODE);
    });

    it('should return Left when period is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutPeriod().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_DATE_TIME');
    });

    it('should return Left when a skill ID is not a valid UUID', () => {
      const result = Project.create(
        ProjectBuilder.build().withSkills(['not-a-valid-uuid']).toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Id.ERROR_CODE);
    });

    it('should return Left when a related project slug is invalid', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withRelatedProjects(['valid-slug', 'INVALID SLUG!'])
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
    });

    it('should return Left when relatedProjects contains the project own slug', () => {
      const slug = 'my-project';
      const result = Project.create(
        ProjectBuilder.build()
          .withSlug(slug)
          .withRelatedProjects(['other-project', slug])
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Project.ERROR_CODE);
    });

    it('should return Left when relatedProjects contains duplicate slugs', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withRelatedProjects(['related-project', 'related-project'])
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Project.ERROR_CODE);
    });

    it('should return Left when thumbnailImage is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutThumbnailImage().toProps(),
      );

      expect(result.isLeft()).toBe(true);
    });

    it('should return Left when status is invalid', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withStatus('INVALID' as ProjectStatus)
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Project.ERROR_CODE);
    });

    it('should return Left when repositoryUrl is not a valid URL', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withRepositoryUrl('not-a-valid-url')
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Url.ERROR_CODE);
    });
  });

  describe('isPublic()', () => {
    it('should return true when repositoryUrl is set', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withRepositoryUrl('https://github.com/wallace-sf/portfolio')
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.isPublic()).toBe(true);
    });

    it('should return false when repositoryUrl is not set', () => {
      const result = Project.create(ProjectBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.isPublic()).toBe(false);
    });
  });

  describe('publish()', () => {
    it('should return Right and set status to PUBLISHED when project is in DRAFT', () => {
      const result = Project.create(
        ProjectBuilder.build().withStatus(ProjectStatus.DRAFT).toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      const project = result.value;

      const publishResult = project.publish();

      expect(publishResult.isRight()).toBe(true);
      expect(project.status).toBe(ProjectStatus.PUBLISHED);
    });

    it('should return Left when project is already PUBLISHED', () => {
      const result = Project.create(
        ProjectBuilder.build().withStatus(ProjectStatus.PUBLISHED).toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      const project = result.value;

      const publishResult = project.publish();

      expect(publishResult.isLeft()).toBe(true);
      expect((publishResult.value as ValidationError).code).toBe(
        Project.ERROR_CODE,
      );
    });
  });

  describe('archive()', () => {
    it('should return Right and set status to ARCHIVED when project is in DRAFT', () => {
      const result = Project.create(
        ProjectBuilder.build().withStatus(ProjectStatus.DRAFT).toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      const project = result.value;

      const archiveResult = project.archive();

      expect(archiveResult.isRight()).toBe(true);
      expect(project.status).toBe(ProjectStatus.ARCHIVED);
    });

    it('should return Left when project is already ARCHIVED', () => {
      const result = Project.create(
        ProjectBuilder.build().withStatus(ProjectStatus.ARCHIVED).toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      const project = result.value;

      const archiveResult = project.archive();

      expect(archiveResult.isLeft()).toBe(true);
      expect((archiveResult.value as ValidationError).code).toBe(
        Project.ERROR_CODE,
      );
    });
  });
});
