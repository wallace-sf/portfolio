import { Skill, Text, ValidationError } from '../../src';
import { SkillBuilder } from '../helpers';

describe('Skill', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid Skill', () => {
      const result = Skill.create(SkillBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Skill);
    });

    it('should expose description and icon as VOs and type as enum', () => {
      const props = SkillBuilder.build().toProps();
      const result = Skill.create(props);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.description.value).toBe(props.description);
      expect(result.value.icon.value).toBe(props.icon);
      expect(result.value.type).toBe(props.type);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when description is missing', () => {
      const result = Skill.create(
        SkillBuilder.build().withoutDescription().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when icon is missing', () => {
      const result = Skill.create(
        SkillBuilder.build().withoutIcon().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when type is invalid', () => {
      const result = Skill.create(
        SkillBuilder.build().withoutType().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Skill.ERROR_CODE);
    });
  });
});
