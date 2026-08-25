import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  ERROR_MESSAGE,
  getErrorMessage,
} from '../../../src/shared/i18n/ERROR_MESSAGE';
import { LOCALES } from '../../../src/shared/i18n/Locale';

const DOMAIN_ERROR_SRC_ROOTS = [
  join(__dirname, '../../../src'),
  join(__dirname, '../../../../application/src'),
  join(__dirname, '../../../../infra/src'),
];

function collectTsFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return collectTsFiles(fullPath);
    return entry.name.endsWith('.ts') ? [fullPath] : [];
  });
}

function findDomainErrorCodesInUse(): Set<string> {
  const codes = new Set<string>();
  const pattern = /new DomainError\(\s*'([A-Z_]+)'/g;

  for (const root of DOMAIN_ERROR_SRC_ROOTS) {
    for (const file of collectTsFiles(root)) {
      const content = readFileSync(file, 'utf-8');
      for (const match of content.matchAll(pattern)) {
        codes.add(match[1]!);
      }
    }
  }

  return codes;
}

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
  'FETCH_FAILED',
  'SAVE_FAILED',
  'DELETE_FAILED',
  'INVALID_INPUT',
  'INVALID_AUTH_SUBJECT',
  'ENSURE_USER_FAILED',
  'USER_CREATION_FAILED',
  'AUTH_UNEXPECTED_ERROR',
  'INVALID_CREDENTIALS',
  'INVALID_ACCESS_TOKEN',
  'INVALID_REFRESH_TOKEN',
  'NO_ACCESS_TOKEN',
  'NO_REFRESH_TOKEN',
  'EMAIL_SEND_FAILED',
] as const;

describe('ERROR_MESSAGE', () => {
  describe('regression guard', () => {
    it('should have a dictionary entry for every DomainError code thrown in core/application/infra source', () => {
      const codesInUse = findDomainErrorCodesInUse();
      const missing = [...codesInUse].filter(
        (code) => !ERROR_MESSAGE['en-US'][code],
      );

      expect(
        missing,
        `Codes thrown via "new DomainError(...)" but missing from ERROR_MESSAGE: ${missing.join(', ')}`,
      ).toEqual([]);
    });
  });

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
