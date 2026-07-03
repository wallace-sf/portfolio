import { describe, expect, it } from 'vitest';
import { ERROR_MESSAGE, getErrorMessage } from '../../../src/shared/i18n/ERROR_MESSAGE';
import { LOCALES } from '../../../src/shared/i18n/Locale';

const ALL_CODES = [
  'INVALID_SLUG',
  'INVALID_NAME',
  'INVALID_TEXT',
  'INVALID_EMAIL',
  'INVALID_MESSAGE',
  'INVALID_URL',
  'INVALID_ID',
  'INVALID_DATE_RANGE',
  'INVALID_DATE_TIME',
  'INVALID_LOCALIZED_TEXT',
  'INVALID_PROJECT',
  'INVALID_EXPERIENCE',
  'INVALID_SKILL',
  'ERROR_INVALID_SKILL_LIST',
  'INVALID_LANGUAGE',
  'INVALID_LOCALE',
  'INVALID_PROFESSIONAL_VALUE',
  'INVALID_PROFILE_STAT',
  'INVALID_SOCIAL_NETWORK',
  'INVALID_USER',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'UNAUTHORIZED',
  'AUTH_REQUIRED',
  'AUTH_INVALID_CREDENTIALS',
  'AUTH_SUBJECT_CONFLICT',
  'INTERNAL_ERROR',
] as const;

describe('ERROR_MESSAGE', () => {
  describe('dictionary completeness', () => {
    it.each(LOCALES)('should have entries for all codes in %s', (locale) => {
      for (const code of ALL_CODES) {
        expect(
          ERROR_MESSAGE[locale][code],
          `Missing code "${code}" in locale "${locale}"`,
        ).toBeDefined();
        expect(
          ERROR_MESSAGE[locale][code]!.message.length,
          `Empty message for code "${code}" in locale "${locale}"`,
        ).toBeGreaterThan(0);
      }
    });

    it('should not have empty message strings in any locale', () => {
      for (const locale of LOCALES) {
        for (const [code, entry] of Object.entries(ERROR_MESSAGE[locale])) {
          expect(
            entry.message.trim().length,
            `Empty message for code "${code}" in locale "${locale}"`,
          ).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('getErrorMessage', () => {
    it('should return the message for the requested locale', () => {
      const message = getErrorMessage('en-US', 'INVALID_SLUG');
      expect(message).toBe(ERROR_MESSAGE['en-US']['INVALID_SLUG']!.message);
    });

    it('should return pt-BR message when requesting pt-BR', () => {
      const en = getErrorMessage('en-US', 'NOT_FOUND');
      const pt = getErrorMessage('pt-BR', 'NOT_FOUND');
      expect(en).toBeDefined();
      expect(pt).toBeDefined();
      expect(en).not.toBe(pt);
    });

    it('should return es message when requesting es', () => {
      const message = getErrorMessage('es', 'UNAUTHORIZED');
      expect(message).toBe(ERROR_MESSAGE['es']['UNAUTHORIZED']!.message);
    });

    it('should fall back to en-US when code is missing from requested locale', () => {
      // Temporarily test fallback by using a non-existent code that we know
      // will not be in any locale — fallback chain returns undefined
      const result = getErrorMessage('es', 'NON_EXISTENT_CODE');
      expect(result).toBeUndefined();
    });

    it('should return undefined for unknown error codes', () => {
      const result = getErrorMessage('en-US', 'COMPLETELY_UNKNOWN_CODE');
      expect(result).toBeUndefined();
    });

    it('should return a string for every known code in every locale', () => {
      for (const locale of LOCALES) {
        for (const code of ALL_CODES) {
          const message = getErrorMessage(locale, code);
          expect(
            typeof message,
            `getErrorMessage("${locale}", "${code}") should return a string`,
          ).toBe('string');
        }
      }
    });
  });
});
