import { Skill, SkillFactory, SkillType, ValidationError } from '../../src';
import { SkillBuilder } from '../data';

const expectValidationError = (
  action: () => unknown,
  expectedCode: string,
  expectedMessage?: string,
): void => {
  try {
    action();
    throw new Error('Expected a ValidationError to be thrown.');
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError);
    expect((error as ValidationError).code).toBe(expectedCode);
    if (expectedMessage) {
      expect((error as ValidationError).message).toContain(expectedMessage);
    }
  }
};

describe('SkillFactory', () => {
  it('should create multiple skills when all props are valid', () => {
    const props = SkillBuilder.listToProps(3);

    const skills = SkillFactory.bulk(props);

    expect(skills).toHaveLength(3);
    expect(skills.every((s) => s instanceof Skill)).toBe(true);
  });

  it('should return empty array when given empty array', () => {
    const skills = SkillFactory.bulk([]);

    expect(skills).toHaveLength(0);
  });

  it('should reject skill lists when the input is not an array', () => {
    expectValidationError(
      () => SkillFactory.bulk(undefined as unknown as never[]),
      'ERROR_INVALID_SKILL_LIST',
      'Skills must be provided as an array.',
    );
  });

  it('should throw validation error when one skill has invalid props', () => {
    const props = SkillBuilder.listToProps(2);
    props[0]!.type = '' as 'EDUCATION';

    expectValidationError(
      () => SkillFactory.bulk(props),
      SkillType.ERROR_CODE,
      'The value must be a valid skill type.',
    );
  });
});
