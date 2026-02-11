
import { SkillType, ValidationError } from '../../src';

describe('SkillType', () => {
  describe('when is new', () => {
    it('should be valid when param is valid', () => {
      const education = SkillType.new('EDUCATION');
      const language = SkillType.new('LANGUAGE');
      const other = SkillType.new('OTHER');
      const soft = SkillType.new('SOFT');
      const technology = SkillType.new('TECHNOLOGY');

      expect(education.value).toBe('EDUCATION');
      expect(language.value).toBe('LANGUAGE');
      expect(other.value).toBe('OTHER');
      expect(soft.value).toBe('SOFT');
      expect(technology.value).toBe('TECHNOLOGY');
      expect(education.isNew).toBe(false);
      expect(language.isNew).toBe(false);
      expect(other.isNew).toBe(false);
      expect(soft.isNew).toBe(false);
      expect(technology.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => SkillType.new('' as 'EDUCATION')).toThrow(
        new ValidationError({ code: SkillType.ERROR_CODE, message: 'O valor deve ser um tipo de habilidade válido.' }),
      );
      expect(() => SkillType.new('#' as 'EDUCATION')).toThrow(
        new ValidationError({ code: SkillType.ERROR_CODE, message: 'O valor deve ser um tipo de habilidade válido.' }),
      );
    });
  });

  describe('when is compared', () => {
    it('should be valid when two fluencies are equal', () => {
      const param = 'EDUCATION';

      const skillType1 = SkillType.new(param);
      const skillType2 = SkillType.new(skillType1.value);

      expect(skillType1.equals(skillType2)).toBe(true);
      expect(skillType1.diff(skillType2)).toBe(false);
    });
  });
});
