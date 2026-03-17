import {
  LocalizedText,
  Project,
  ProjectStatus,
  Slug,
  SkillType,
  ValidationError,
} from '../../src';
import { ProjectBuilder, SkillBuilder } from '../helpers';

describe('Project', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid Project', () => {
      const result = Project.create(ProjectBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Project);
    });

    it('should create project with all required fields as VOs', () => {
      const title = { 'pt-BR': 'Meu Projeto', 'en-US': 'My Project' };
      const caption = { 'pt-BR': 'Uma legenda para o projeto.' };
      const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      const skills = SkillBuilder.listToProps(2);

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
      expect(result.value.content.value).toBe(content);
      expect(result.value.skills).toHaveLength(2);
    });

    it('should create project with slug and coverImage', () => {
      const result = Project.create(
        ProjectBuilder.build()
          .withSlug('fieldlink-form-builder')
          .withCoverImage({
            url: 'https://example.com/cover.png',
            alt: { 'pt-BR': 'Imagem de capa' },
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
          .withTheme({ 'pt-BR': 'Design System' })
          .withSummary({ 'pt-BR': 'Resumo do projeto.' })
          .withObjectives({ 'pt-BR': 'Objetivo do projeto.' })
          .withRole({ 'pt-BR': 'Tech Lead' })
          .withTeam('Squad Alpha')
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
      expect(result.value.team).toBe('Squad Alpha');
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

    it('should have undefined optional fields when not provided', () => {
      const result = Project.create(ProjectBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.theme).toBeUndefined();
      expect(result.value.summary).toBeUndefined();
      expect(result.value.objectives).toBeUndefined();
      expect(result.value.role).toBeUndefined();
      expect(result.value.team).toBeUndefined();
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
      expect((result.value as ValidationError).code).toBe('INVALID_TEXT');
    });

    it('should return Left when skills are not provided as array', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutSkills().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        'ERROR_INVALID_SKILL_LIST',
      );
    });

    it('should return Left when period is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutPeriod().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_DATE_TIME');
    });

    it('should propagate nested skill validation errors', () => {
      const skills = SkillBuilder.listToProps(2);
      skills[0]!.type = '' as SkillType['value'];

      const result = Project.create(
        ProjectBuilder.build().withSkills(skills).toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(SkillType.ERROR_CODE);
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
  });
});
