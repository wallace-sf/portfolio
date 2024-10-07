import { faker } from '@faker-js/faker';
import { ValidationError } from '@repo/utils';

import {
  Experience,
  Text,
  LocationType,
  EmploymentType,
  DateTime,
} from '../../src';
import { ExperienceBuilder, SkillBuilder } from '../data';

describe('Experience', () => {
  it('should be valid when props are valid', () => {
    const experience = ExperienceBuilder.build().now();

    expect(experience).toBeInstanceOf(Experience);
  });

  it('should be invalid when company is invalid', () => {
    expect(() => ExperienceBuilder.build().withoutCompany().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 3 e 100 caracteres.',
      ),
    );
  });

  it('should be invalid when employment type is invalid', () => {
    expect(() =>
      ExperienceBuilder.build().withoutEmploymentType().now(),
    ).toThrow(
      new ValidationError(
        EmploymentType.ERROR_CODE,
        'O valor deve ser um tipo de emprego válido.',
      ),
    );
  });

  it('should be invalid when end at is invalid', () => {
    expect(() => ExperienceBuilder.build().withEndAt('#').now()).toThrow(
      new ValidationError(
        DateTime.ERROR_CODE,
        'O valor deve ser uma data e hora válida.',
      ),
    );
  });

  it('should be invalid when start at is invalid', () => {
    expect(() => ExperienceBuilder.build().withStartAt('#').now()).toThrow(
      new ValidationError(
        DateTime.ERROR_CODE,
        'O valor deve ser uma data e hora válida.',
      ),
    );
  });

  it('should be invalid when position is invalid', () => {
    expect(() => ExperienceBuilder.build().withoutPosition().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 3 e 100 caracteres.',
      ),
    );
  });

  it('should be invalid when location is invalid', () => {
    expect(() => ExperienceBuilder.build().withoutLocation().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 3 e 100 caracteres.',
      ),
    );
  });

  it('should be invalid when location type is invalid', () => {
    expect(() => ExperienceBuilder.build().withoutLocationType().now()).toThrow(
      new ValidationError(
        LocationType.ERROR_CODE,
        'O valor deve ser um tipo localização válido.',
      ),
    );
  });

  it('should be invalid when start at is greather than end at', () => {
    expect(() =>
      ExperienceBuilder.build()
        .withStartAt('2022-01-02')
        .withEndAt('2021-01-01')
        .now(),
    ).toThrow(
      new ValidationError(
        Experience.ERROR_CODE,
        'O início da carreira deve ser menor ou igual ao final da carreira.',
      ),
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
    const skills = SkillBuilder.listToProps(
      faker.number.int({ min: 0, max: 10 }),
    );

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
    expect(experience.skills.map((s) => s.props)).toEqual(skills);
  });

  it('should create new experience without end at', () => {
    const experience = ExperienceBuilder.build().withoutEndAt().now();

    expect(experience).toBeInstanceOf(Experience);
    expect(experience.end_at?.value).toBeUndefined();
  });

  it('should create multiple experiences from valid props', () => {
    const experiences = ExperienceBuilder.list(2);

    expect(experiences).toHaveLength(2);
  });
});
