import type { DomainError, Locale } from '@repo/core/shared';
import { getErrorMessage } from '@repo/core/shared';

export type ErrorDTO = {
  code: string;
  message: string;
};

export function toErrorDTO(
  error: DomainError,
  locale: Locale,
  httpCode?: string,
): ErrorDTO {
  const lookupCode = httpCode ?? error.code;
  const message =
    getErrorMessage(locale, lookupCode) ??
    getErrorMessage(locale, error.code) ??
    error.message;
  return { code: lookupCode, message };
}
