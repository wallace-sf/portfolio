import { Translator } from '../src/i18n';

Translator.setLocales(['pt-BR', 'es', 'fr']);

describe('Translator', () => {
  it('should validate locations', () => {
    expect(Translator.locales).toEqual(['en-US', 'pt-BR', 'es', 'fr']);
  });

  it('should validate i18n', () => {
    const locale = 'pt-BR';
    const code = 'TEST_MESSAGE';
    const message = 'This is a test message.';
    const i18n = { [locale]: { [code]: message }, es: {}, fr: {} };

    expect(Translator.i18n(i18n, code, locale)).toEqual(message);
  });

  it('should validate i18n with default location', () => {
    const code = 'TEST_MESSAGE';
    const message = 'This is a test message.';
    const i18n = { 'en-US': { [code]: message }, es: {}, fr: {} };

    expect(Translator.i18n(i18n, code)).toEqual(message);
  });

  it('should return null with valid locale', () => {
    const code = 'TEST_MESSAGE';
    const message = 'This is a test message.';
    const i18n = { 'pt-BR': { [code]: message }, es: {}, fr: {} };

    expect(Translator.i18n(i18n, code, 'es')).toEqual(null);
  });

  it('should return null with invalid locale', () => {
    const code = 'TEST_MESSAGE';
    const message = 'This is a test message.';
    const i18n = { 'pt-BR': { [code]: message }, es: {}, fr: {} };

    expect(Translator.i18n(i18n, code, 'de')).toEqual(null);
  });
});
