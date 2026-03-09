import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';
import type { Locale } from './Locale';

export type LocalizedTextValue = Readonly<{
  es?: string;
  'en-US'?: string;
  'pt-BR': string;
}>;

export interface ILocalizedTextInput {
  es?: string;
  'en-US'?: string;
  'pt-BR': string;
}

function trimOrUndefined(s: string | undefined): string | undefined {
  if (s == null) return undefined;
  const t = s.trim();
  return t === '' ? undefined : t;
}

function normalizeInput(input: ILocalizedTextInput): LocalizedTextValue {
  const ptBR = input['pt-BR']?.trim() ?? '';
  const enUS = trimOrUndefined(input['en-US']);
  const es = trimOrUndefined(input.es);

  return Object.freeze({
    'pt-BR': ptBR,
    ...(enUS !== undefined && { 'en-US': enUS }),
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
    const trimmed = input['pt-BR']?.trim();
    if (trimmed == null || trimmed === '') {
      return left(
        new ValidationError({
          code: LocalizedText.ERROR_CODE,
          message: 'pt-BR is required and must be non-empty after trim.',
        }),
      );
    }
    return right(new LocalizedText(normalizeInput(input)));
  }

  /** @deprecated Use LocalizedText.create() instead */
  static new(input: ILocalizedTextInput): LocalizedText {
    const result = LocalizedText.create(input);
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  /**
   * Returns text for the requested locale, with optional fallback.
   * - Uses `locale` if available and non-empty.
   * - Else uses `fallback` if provided and available.
   * - Else uses pt-BR.
   */
  get(locale: Locale, fallback?: Locale): string {
    const v = this.value;
    const forLocale = this._getLocaleValue(v, locale);
    if (forLocale !== undefined && forLocale !== '') return forLocale;
    if (fallback !== undefined) {
      const forFallback = this._getLocaleValue(v, fallback);
      if (forFallback !== undefined && forFallback !== '') return forFallback;
    }
    return v['pt-BR'];
  }

  private _getLocaleValue(
    v: LocalizedTextValue,
    locale: Locale,
  ): string | undefined {
    switch (locale) {
      case 'pt-BR':
        return v['pt-BR'];
      case 'en-US':
        return v['en-US'];
      case 'es':
        return v.es;
      default:
        return undefined;
    }
  }
}
