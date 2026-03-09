import { Language, Name, Fluency, Text, ValidationError } from '../../src';
import { LanguageBuilder } from '../data';

describe('Language', () => {
  it('should be valid when props are valid', () => {
    const language = LanguageBuilder.build().now();

    expect(language).toBeInstanceOf(Language);
  });

  it('should be invalid when name is invalid', () => {
    expect(() => LanguageBuilder.build().withoutName().now()).toThrow(
      new ValidationError({ code: Name.ERROR_CODE, message: 'The name must contain only letters.' }),
    );
  });

  it('should be invalid when fluency is invalid', () => {
    expect(() => LanguageBuilder.build().withoutFluency().now()).toThrow(
      new ValidationError({
        code: Fluency.ERROR_CODE,
        message: 'The value must be a valid fluency level.',
      }),
    );
  });

  it('should be invalid when locale is invalid', () => {
    expect(() => LanguageBuilder.build().withoutLocale().now()).toThrow(
      new ValidationError({
        code: Text.ERROR_CODE,
        message: 'The value must be between 2 and 50 characters.',
      }),
    );
  });

  it('should create new language from valid props', () => {
    const name = 'Português';
    const fluency = 'BEGINNER';
    const locale = 'pt-BR';

    const language = LanguageBuilder.build()
      .withName(name)
      .withFluency(fluency)
      .withLocale(locale)
      .now();

    expect(language).toBeInstanceOf(Language);
    expect(language.name.value).toBe(name);
    expect(language.fluency.value).toBe(fluency);
    expect(language.locale.value).toBe(locale);
  });

  it('should create multiple languages from valid props', () => {
    const languages = LanguageBuilder.list(2);

    expect(languages).toHaveLength(2);
  });
});
