import { isNotNil } from '../validations';
import { Translatei18n } from './Translatei18n';
import { I18n } from './types';

export class Translator {
  private static _defaultLocale: string;
  private static _locales: Set<string> = new Set();

  public static get locales(): Array<string | null> {
    return Array.from(this._locales);
  }

  public static setDefaultLocale(locale: string): typeof Translator {
    this._defaultLocale = locale;
    this._locales = new Set([locale, ...this._locales]);
    return this;
  }

  public static setLocales(locales: Array<string>): typeof Translator {
    const newLocales = [...this.locales, ...locales].filter(isNotNil);
    this._locales = new Set(newLocales as Array<string>);
    return this;
  }

  public static i18n(i18n: I18n, code: string, locale?: string): string | null {
    const newLocale = locale ?? this._defaultLocale;

    if (newLocale && this.locales.includes(newLocale)) {
      return new Translatei18n(i18n, newLocale).translate(code);
    }

    return null;
  }
}
