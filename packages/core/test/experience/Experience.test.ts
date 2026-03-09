import {
  Experience,
  Text,
  LocationType,
  EmploymentType,
  DateTime,
  SkillType,
  ValidationError,
} from '../../src';
import { ExperienceBuilder, SkillBuilder } from '../data';

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

describe('Experience', () => {
  it('should be valid when props are valid', () => {
    const experience = ExperienceBuilder.build().now();

    expect(experience).toBeInstanceOf(Experience);
  });

  it('should be invalid when company is invalid', () => {
    expectValidationError(
      () => ExperienceBuilder.build().withoutCompany().now(),
      Text.ERROR_CODE,
      'The value must be between 3 and 100 characters.',
    );
  });

  it('should be invalid when employment type is invalid', () => {
    expectValidationError(
      () => ExperienceBuilder.build().withoutEmploymentType().now(),
      EmploymentType.ERROR_CODE,
      'The value must be a valid employment type.',
    );
  });

  it('should be invalid when end at is invalid', () => {
    expectValidationError(
      () => ExperienceBuilder.build().withEndAt('#').now(),
      DateTime.ERROR_CODE,
      'The value must be a valid date and time.',
    );
  });

  it('should be invalid when start at is invalid', () => {
    expectValidationError(
      () => ExperienceBuilder.build().withStartAt('#').now(),
      DateTime.ERROR_CODE,
      'The value must be a valid date and time.',
    );
  });

  it('should be invalid when position is invalid', () => {
    expectValidationError(
      () => ExperienceBuilder.build().withoutPosition().now(),
      Text.ERROR_CODE,
      'The value must be between 3 and 100 characters.',
    );
  });

  it('should be invalid when location is invalid', () => {
    expectValidationError(
      () => ExperienceBuilder.build().withoutLocation().now(),
      Text.ERROR_CODE,
      'The value must be between 3 and 100 characters.',
    );
  });

  it('should be invalid when location type is invalid', () => {
    expectValidationError(
      () => ExperienceBuilder.build().withoutLocationType().now(),
      LocationType.ERROR_CODE,
      'The value must be a valid location type.',
    );
  });

  it('should be valid when start_at equals end_at', () => {
    const date = new Date('2022-01-01').toISOString();

    const experience = ExperienceBuilder.build()
      .withStartAt(date)
      .withEndAt(date)
      .now();

    expect(experience).toBeInstanceOf(Experience);
  });

  it('should be invalid when start at is greather than end at', () => {
    expectValidationError(
      () =>
        ExperienceBuilder.build()
          .withStartAt('2022-01-02')
          .withEndAt('2021-01-01')
          .now(),
      Experience.ERROR_CODE,
      'The start of the career must be less than or equal to the end of the career.',
    );
  });

  it('should create new experience from valid props', () => {
    const company = 'Fieldlink';
    const employmentType = 'APPRENTICE';
    const startAt = new Date('2022-01-01').toISOString();
    const endAt = new Date('2022-01-02').toISOString();
    const position = 'Software Engineer';
    const location = 'São Paulo, Brazil';
    const locationType = 'REMOTE';
    const skills = SkillBuilder.listToProps(2);

    const experience = ExperienceBuilder.build()
      .withCompany(company)
      .withEmploymentType(employmentType)
      .withStartAt(startAt)
      .withEndAt(endAt)
      .withPosition(position)
      .withLocation(location)
      .withLocationType(locationType)
      .withSkills(skills)
      .now();

    expect(experience).toBeInstanceOf(Experience);
    expect(experience.company.value).toBe(company);
    expect(experience.employment_type.value).toBe(employmentType);
    expect(experience.start_at.value).toBe(startAt);
    expect(experience.end_at?.value).toBe(endAt);
    expect(experience.position.value).toBe(position);
    expect(experience.location.value).toBe(location);
    expect(experience.location_type.value).toBe(locationType);
    expect(experience.skills.map((s) => s.props)).toMatchObject(skills);
  });

  it('should create new experience without end at', () => {
    const experience = ExperienceBuilder.build().withoutEndAt().now();

    expect(experience).toBeInstanceOf(Experience);
    expect(experience.end_at?.value).toBeUndefined();
  });

  it('should allow experiences without related skills when the list is empty', () => {
    const experience = ExperienceBuilder.build().withSkills([]).now();

    expect(experience.skills).toEqual([]);
  });

  it('should reject experiences when skills are not provided', () => {
    expectValidationError(
      () => ExperienceBuilder.build().withoutSkills().now(),
      'ERROR_INVALID_SKILL_LIST',
      'Skills must be provided as an array.',
    );
  });

  it('should propagate nested skill validation errors', () => {
    const skills = SkillBuilder.listToProps(2);
    skills[0]!.type = '' as SkillType['value'];

    expectValidationError(
      () => ExperienceBuilder.build().withSkills(skills).now(),
      SkillType.ERROR_CODE,
      'The value must be a valid skill type.',
    );
  });
});
