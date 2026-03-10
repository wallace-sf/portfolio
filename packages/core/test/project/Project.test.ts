import {
  Project,
  SkillType,
  Text,
  ValidationError,
} from '../../src';
import { ProjectBuilder, SkillBuilder } from '../data';

describe('Project', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid Project', () => {
      const result = Project.create(ProjectBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Project);
    });

    it('should create project with all fields as VOs', () => {
      const title = 'Fieldlink Form Builder';
      const caption =
        'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.';
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
      expect(result.value.title.value).toBe(title);
      expect(result.value.caption.value).toBe(caption);
      expect(result.value.content.value).toBe(content);
      expect(result.value.skills).toHaveLength(2);
    });

    it('should allow projects without skills when the list is empty', () => {
      const result = Project.create(
        ProjectBuilder.build().withSkills([]).toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.skills).toHaveLength(0);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when title is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutTitle().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when caption is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutCaption().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when content is missing', () => {
      const result = Project.create(
        ProjectBuilder.build().withoutContent().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
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

    it('should propagate nested skill validation errors', () => {
      const skills = SkillBuilder.listToProps(2);
      skills[0]!.type = '' as SkillType['value'];

      const result = Project.create(
        ProjectBuilder.build().withSkills(skills).toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        SkillType.ERROR_CODE,
      );
    });
  });
});
