import { Skill, SkillFactory, SkillType, ValidationError } from '../../src';
import { SkillBuilder } from '../data';

describe('SkillFactory', () => {
  describe('bulk()', () => {
    it('should return Right with skill list when all props are valid', () => {
      const result = SkillFactory.bulk(SkillBuilder.listToProps(3));

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value).toHaveLength(3);
      expect(result.value.every((s) => s instanceof Skill)).toBe(true);
    });

    it('should return Right with empty array when given empty array', () => {
      const result = SkillFactory.bulk([]);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value).toHaveLength(0);
    });

    it('should return Left when input is not an array', () => {
      const result = SkillFactory.bulk(undefined as unknown as never[]);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        SkillFactory.ERROR_CODE,
      );
      expect((result.value as ValidationError).message).toContain(
        'Skills must be provided as an array.',
      );
    });

    it('should return Left with index when one skill has invalid props', () => {
      const props = SkillBuilder.listToProps(2);
      props[0]!.type = '' as 'EDUCATION';

      const result = SkillFactory.bulk(props);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        SkillType.ERROR_CODE,
      );
    });
  });
});
