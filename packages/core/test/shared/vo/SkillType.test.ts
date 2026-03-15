import { SkillType, ValidationError } from '../../../src';

describe('SkillType', () => {
  describe('when created from valid value', () => {
    it('should return Right for every valid skill type', () => {
      const skills = SkillType.SKILLS;

      for (const skill of skills) {
        const result = SkillType.create(skill);
        expect(result.isRight()).toBe(true);
        if (!result.isRight()) continue;
        expect(result.value.value).toBe(skill);
      }
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left with ValidationError for empty string', () => {
      const result = SkillType.create('' as 'EDUCATION');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(SkillType.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe(
        'The value must be a valid skill type.',
      );
    });

    it('should return Left for unrecognized value', () => {
      const result = SkillType.create('#' as 'EDUCATION');

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(SkillType.ERROR_CODE);
    });
  });

  describe('when compared', () => {
    it('should be equal when two skill types have the same value', () => {
      const r1 = SkillType.create('EDUCATION');
      const r2 = SkillType.create('EDUCATION');

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
      expect(r1.value.diff(r2.value)).toBe(false);
    });
  });
});
