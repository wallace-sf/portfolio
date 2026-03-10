import {
  DateTime,
  EmploymentType,
  Experience,
  LocationType,
  SkillType,
  Text,
  ValidationError,
} from '../../src';
import { ExperienceBuilder, SkillBuilder } from '../data';

describe('Experience', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid Experience', () => {
      const result = Experience.create(ExperienceBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Experience);
    });

    it('should create experience with all fields as VOs', () => {
      const company = 'Fieldlink';
      const employmentType = 'APPRENTICE';
      const startAt = new Date('2022-01-01').toISOString();
      const endAt = new Date('2022-01-02').toISOString();
      const position = 'Software Engineer';
      const location = 'São Paulo, Brazil';
      const locationType = 'REMOTE';
      const skills = SkillBuilder.listToProps(2);

      const result = Experience.create(
        ExperienceBuilder.build()
          .withCompany(company)
          .withEmploymentType(employmentType)
          .withStartAt(startAt)
          .withEndAt(endAt)
          .withPosition(position)
          .withLocation(location)
          .withLocationType(locationType)
          .withSkills(skills)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.company.value).toBe(company);
      expect(result.value.employment_type.value).toBe(employmentType);
      expect(result.value.start_at.value).toBe(startAt);
      expect(result.value.end_at?.value).toBe(endAt);
      expect(result.value.position.value).toBe(position);
      expect(result.value.location.value).toBe(location);
      expect(result.value.location_type.value).toBe(locationType);
      expect(result.value.skills).toHaveLength(2);
    });

    it('should allow experience without end date', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutEndAt().toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.end_at).toBeUndefined();
    });

    it('should allow experience without skills', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withSkills([]).toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.skills).toHaveLength(0);
    });

    it('should return Right when start_at equals end_at', () => {
      const date = new Date('2022-01-01').toISOString();

      const result = Experience.create(
        ExperienceBuilder.build().withStartAt(date).withEndAt(date).toProps(),
      );

      expect(result.isRight()).toBe(true);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when company is missing', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutCompany().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when employment type is invalid', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutEmploymentType().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        EmploymentType.ERROR_CODE,
      );
    });

    it('should return Left when start_at is invalid', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withStartAt('#').toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        DateTime.ERROR_CODE,
      );
    });

    it('should return Left when end_at is invalid', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withEndAt('#').toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        DateTime.ERROR_CODE,
      );
    });

    it('should return Left when position is missing', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutPosition().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when location is missing', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutLocation().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when location type is invalid', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutLocationType().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocationType.ERROR_CODE,
      );
    });

    it('should return Left when start_at is greater than end_at', () => {
      const result = Experience.create(
        ExperienceBuilder.build()
          .withStartAt('2022-01-02T00:00:00.000Z')
          .withEndAt('2021-01-01T00:00:00.000Z')
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        Experience.ERROR_CODE,
      );
    });

    it('should propagate nested skill validation errors', () => {
      const skills = SkillBuilder.listToProps(2);
      skills[0]!.type = '' as SkillType['value'];

      const result = Experience.create(
        ExperienceBuilder.build().withSkills(skills).toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        SkillType.ERROR_CODE,
      );
    });
  });
});
