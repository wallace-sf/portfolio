import { Fluency, Language, Name, Text, ValidationError } from '../../src';
import { LanguageBuilder } from '../data';

describe('Language', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid Language', () => {
      const result = Language.create(LanguageBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Language);
    });

    it('should create language with all fields as VOs', () => {
      const name = 'Português';
      const fluency = 'BEGINNER';
      const locale = 'pt-BR';

      const result = Language.create(
        LanguageBuilder.build()
          .withName(name)
          .withFluency(fluency)
          .withLocale(locale)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.name.value).toBe(name);
      expect(result.value.fluency.value).toBe(fluency);
      expect(result.value.locale.value).toBe(locale);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when name is invalid', () => {
      const result = Language.create(
        LanguageBuilder.build().withoutName().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Name.ERROR_CODE);
    });

    it('should return Left when fluency is invalid', () => {
      const result = Language.create(
        LanguageBuilder.build().withoutFluency().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Fluency.ERROR_CODE);
    });

    it('should return Left when locale is invalid', () => {
      const result = Language.create(
        LanguageBuilder.build().withoutLocale().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });
  });
});
