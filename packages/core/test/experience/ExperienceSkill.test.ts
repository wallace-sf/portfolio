import { ExperienceSkill, LocalizedText, ValidationError } from '../../src';
import { SkillBuilder } from '../helpers';

describe('ExperienceSkill', () => {
  const validSkillProps = () => SkillBuilder.listToProps(1)[0]!;
  const validWorkDescription = { 'pt-BR': 'Desenvolvimento de componentes React.' };

  describe('when created from valid props', () => {
    it('should return Right with a valid ExperienceSkill', () => {
      const result = ExperienceSkill.create({
        skill: validSkillProps(),
        workDescription: validWorkDescription,
      });

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(ExperienceSkill);
    });

    it('should expose skill and workDescription via getters', () => {
      const result = ExperienceSkill.create({
        skill: validSkillProps(),
        workDescription: { 'pt-BR': 'Backend com Node.js.', 'en-US': 'Backend with Node.js.' },
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.workDescription.get('pt-BR')).toBe('Backend com Node.js.');
      expect(result.value.workDescription.get('en-US')).toBe('Backend with Node.js.');
    });

    it('should expose the skill entity via getter', () => {
      const skillProps = validSkillProps();
      const result = ExperienceSkill.create({
        skill: skillProps,
        workDescription: validWorkDescription,
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.skill.description.value).toBe(skillProps.description);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when skill props are invalid', () => {
      const result = ExperienceSkill.create({
        skill: { ...validSkillProps(), type: '' as never },
        workDescription: validWorkDescription,
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_SKILL_TYPE');
    });

    it('should return Left when workDescription pt-BR is empty', () => {
      const result = ExperienceSkill.create({
        skill: validSkillProps(),
        workDescription: { 'pt-BR': '' },
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });
  });
});
