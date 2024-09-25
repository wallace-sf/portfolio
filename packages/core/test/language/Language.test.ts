import { ValidationError } from '@repo/utils';

import { Language, Name } from '../../src';
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

  it('should create new language from valid props', () => {
    const language = LanguageBuilder.build()
      .withName('Português')
      .withFluency('BEGINNER')
      .withLocale('pt-BR')
      .now();

    expect(language).toBeInstanceOf(Language);
    expect(language.name.value).toBe('Português');
    expect(language.fluency.value).toBe('BEGINNER');
    expect(language.locale.value).toBe('pt-BR');
  });

  it('should create multiple languages from valid props', () => {
    const languages = LanguageBuilder.list(2);

    expect(languages).toHaveLength(2);
  });
});
