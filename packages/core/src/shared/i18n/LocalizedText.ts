import { Validator } from '@repo/utils/validator';

import { ValueObject } from '~/shared/base/ValueObject';
import { left, right, Either } from '~/shared/either';
import { ValidationError } from '~/shared/errors';
import type { Locale } from '~/shared/i18n/Locale';

export type LocalizedTextValue = Readonly<{
  'en-US': string;
  'pt-BR'?: string;
  es?: string;
}>;

export interface ILocalizedTextInput {
  'en-US': string;
  'pt-BR'?: string;
  es?: string;
}

function trimOrUndefined(s: string | undefined): string | undefined {
  if (s == null) return undefined;
  const t = s.trim();
  return t === '' ? undefined : t;
}

function normalizeInput(input: ILocalizedTextInput): LocalizedTextValue {
  const enUS = input['en-US']?.trim() ?? '';
  const ptBR = trimOrUndefined(input['pt-BR']);
  const es = trimOrUndefined(input.es);

  return Object.freeze({
    'en-US': enUS,
    ...(ptBR !== undefined && { 'pt-BR': ptBR }),
    ...(es !== undefined && { es }),
  });
}

export class LocalizedText extends ValueObject<LocalizedTextValue> {
  static readonly ERROR_CODE = 'INVALID_LOCALIZED_TEXT';

  private constructor(value: LocalizedTextValue) {
    super({ value });
  }

  static create(
    input: ILocalizedTextInput,
  ): Either<ValidationError, LocalizedText> {
    const { error, isValid } = Validator.of(input['en-US']?.trim() ?? '')
      .notEmpty('en-US is required and must be non-empty after trim.')
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: LocalizedText.ERROR_CODE, message: error }),
      );

    return right(new LocalizedText(normalizeInput(input)));
  }

  /**
   * Returns text for the requested locale, with optional fallback.
   * - Uses `locale` if available and non-empty.
   * - Else uses `fallback` if provided and available.
   * - Else uses en-US.
   */
  get(locale: Locale, fallback?: Locale): string {
    const v = this.value;
    const forLocale = this._getLocaleValue(v, locale);
    if (forLocale !== undefined && forLocale !== '') return forLocale;
    if (fallback !== undefined) {
      const forFallback = this._getLocaleValue(v, fallback);
      if (forFallback !== undefined && forFallback !== '') return forFallback;
    }
    return v['en-US'];
  }

  private _getLocaleValue(
    v: LocalizedTextValue,
    locale: Locale,
  ): string | undefined {
    switch (locale) {
      case 'en-US':
        return v['en-US'];
      case 'pt-BR':
        return v['pt-BR'];
      case 'es':
        return v.es;
      default:
        return undefined;
    }
  }
}
