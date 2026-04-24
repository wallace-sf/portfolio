import { DEFAULT_LOCALE, isLocale, LOCALES } from '~/index';

describe('Locale', () => {
  it('should export DEFAULT_LOCALE as "en-US"', () => {
    expect(DEFAULT_LOCALE).toBe('en-US');
  });

  it('should export LOCALES as en-US, pt-BR, es', () => {
    expect(LOCALES).toEqual(['en-US', 'pt-BR', 'es']);
  });

  describe('isLocale', () => {
    it('should return true for "en-US", "pt-BR", "es"', () => {
      expect(isLocale('en-US')).toBe(true);
      expect(isLocale('pt-BR')).toBe(true);
      expect(isLocale('es')).toBe(true);
    });

    it('should return false for other strings', () => {
      expect(isLocale('pt')).toBe(false);
      expect(isLocale('en')).toBe(false);
      expect(isLocale('')).toBe(false);
      expect(isLocale('fr')).toBe(false);
    });
  });
});
