import { ValidationError } from '@repo/utils';

import { Skill, Text, SkillType } from '../../src';
import { SkillBuilder } from '../data';
describe('Skill', () => {
  it('should be valid when props are valid', () => {
    const skill = SkillBuilder.build().now();

    expect(skill).toBeInstanceOf(Skill);
  });

  it('should be invalid when description is invalid', () => {
    expect(() => SkillBuilder.build().withoutDescription().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 3 e 50 caracteres.',
      ),
    );
  });

  it('should be invalid when icon is invalid', () => {
    expect(() => SkillBuilder.build().withoutIcon().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 2 e 50 caracteres.',
      ),
    );
  });

  it('should be invalid when type is invalid', () => {
    expect(() => SkillBuilder.build().withoutType().now()).toThrow(
      new ValidationError(
        SkillType.ERROR_CODE,
        'O valor deve ser um tipo de habilidade válido.',
      ),
    );
  });

  it('should create new skill from valid props', () => {
    const description = 'Lorem Ipsum adipiscing elit. Risus.';
    const icon = 'javascript';
    const type = 'LANGUAGE';

    const skill = SkillBuilder.build()
      .withDescription(description)
      .withIcon(icon)
      .withType(type)
      .now();

    expect(skill).toBeInstanceOf(Skill);
    expect(skill.description.value).toBe(description);
    expect(skill.icon.value).toBe(icon);
    expect(skill.type.value).toBe(type);
  });

  it('should create multiple skills from valid props', () => {
    const skills = SkillBuilder.list(2);

    expect(skills).toHaveLength(2);
  });
});
