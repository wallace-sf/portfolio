/**
 * Domain locale identifier. Framework-agnostic; aligned with BCP 47.
 */
export type Locale = 'en-US' | 'es' | 'pt-BR';

export const LOCALES: readonly Locale[] = ['en-US', 'pt-BR', 'es'];

export const DEFAULT_LOCALE: Locale = 'en-US';

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
