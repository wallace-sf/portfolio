import { ValidationError } from '@repo/utils';

import { Language, Name, Fluency, Text } from '../../src';
import { LanguageBuilder } from '../data';

describe('Language', () => {
  it('should be valid when props are valid', () => {
    const language = LanguageBuilder.build().now();

    expect(language).toBeInstanceOf(Language);
  });

  it('should be invalid when name is invalid', () => {
    expect(() => LanguageBuilder.build().withoutName().now()).toThrow(
      new ValidationError(Name.ERROR_CODE, 'Nome deve conter apenas letras.'),
    );
  });

  it('should be invalid when fluency is invalid', () => {
    expect(() => LanguageBuilder.build().withoutFluency().now()).toThrow(
      new ValidationError(
        Fluency.ERROR_CODE,
        'O valor deve ser um nível de fluência válido.',
      ),
    );
  });

  it('should be invalid when locale is invalid', () => {
    expect(() => LanguageBuilder.build().withoutLocale().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 2 e 50 caracteres.',
      ),
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
