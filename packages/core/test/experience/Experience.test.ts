import {
  DateRange,
  EmploymentType,
  Experience,
  LocalizedText,
  LocationType,
  ValidationError,
} from '../../src';
import { ExperienceBuilder, SkillBuilder } from '../data';
import { Data } from '../data/bases';

describe('Experience', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid Experience', () => {
      const result = Experience.create(ExperienceBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Experience);
    });

    it('should create experience with all fields as VOs', () => {
      const company = { 'pt-BR': 'Fieldlink', 'en-US': 'Fieldlink' };
      const position = { 'pt-BR': 'Engenheiro de Software' };
      const location = { 'pt-BR': 'São Paulo, Brasil' };
      const description = { 'pt-BR': 'Desenvolvimento de sistemas.' };
      const startAt = '2022-01-01T00:00:00.000Z';
      const endAt = '2022-06-01T00:00:00.000Z';

      const result = Experience.create(
        ExperienceBuilder.build()
          .withCompany(company)
          .withPosition(position)
          .withLocation(location)
          .withDescription(description)
          .withStartAt(startAt)
          .withEndAt(endAt)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.company.get('pt-BR')).toBe(company['pt-BR']);
      expect(result.value.company.get('en-US')).toBe(company['en-US']);
      expect(result.value.position.get('pt-BR')).toBe(position['pt-BR']);
      expect(result.value.location.get('pt-BR')).toBe(location['pt-BR']);
      expect(result.value.description.get('pt-BR')).toBe(description['pt-BR']);
      expect(result.value.period.startAt.value).toBe(startAt);
      expect(result.value.period.endAt?.value).toBe(endAt);
    });

    it('should create experience with logo and skills', () => {
      const skills = SkillBuilder.listToProps(2).map((skill) => ({
        skill,
        workDescription: { 'pt-BR': 'Desenvolvimento frontend.' },
      }));

      const result = Experience.create(
        ExperienceBuilder.build()
          .withLogo('https://example.com/logo.png', {
            'pt-BR': 'Logo da empresa',
          })
          .withSkills(skills)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.logo.url.value).toBe('https://example.com/logo.png');
      expect(result.value.skills).toHaveLength(2);
      expect(result.value.skills[0]!.workDescription.get('pt-BR')).toBe(
        'Desenvolvimento frontend.',
      );
    });

    it('should allow experience without end date (active)', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutEndAt().toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.period.isActive()).toBe(true);
      expect(result.value.period.endAt).toBeUndefined();
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
      const date = '2022-01-01T00:00:00.000Z';

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
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when position is missing', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutPosition().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when location is missing', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutLocation().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when description is missing', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutDescription().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when logo is missing', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutLogo().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_URL');
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

    it('should return Left when location type is invalid', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withoutLocationType().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocationType.ERROR_CODE,
      );
    });

    it('should return Left when start_at is invalid', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withStartAt('#').toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_DATE_TIME');
    });

    it('should return Left when end_at is invalid', () => {
      const result = Experience.create(
        ExperienceBuilder.build().withEndAt('#').toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe('INVALID_DATE_TIME');
    });

    it('should return Left when start_at is greater than end_at', () => {
      const result = Experience.create(
        ExperienceBuilder.build()
          .withStartAt('2022-01-02T00:00:00.000Z')
          .withEndAt('2021-01-01T00:00:00.000Z')
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(DateRange.ERROR_CODE);
    });

    it('should return Left when a skill has invalid props', () => {
      const result = Experience.create(
        ExperienceBuilder.build()
          .withSkills([
            {
              skill: SkillBuilder.listToProps(1)[0]!,
              workDescription: { 'pt-BR': '' },
            },
          ])
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });
  });

  describe('ExperienceBuilder', () => {
    it('should create multiple experiences', () => {
      const experiences = ExperienceBuilder.list(3);

      expect(experiences).toHaveLength(3);
      experiences.forEach((e) => expect(e).toBeInstanceOf(Experience));
    });
  });
});
