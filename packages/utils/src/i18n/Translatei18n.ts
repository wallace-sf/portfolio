import _get from 'lodash/get';

import { I18n } from './types';

export class Translatei18n {
  private _locale: string;
  private _i18n: I18n | null;

  constructor(i18n: I18n, locale: string) {
    this._i18n = i18n;
    this._locale = locale;
  }

  public translate(code: string): string | null {
    const locale = this._locale;
    const i18n = this._i18n;

    return _get(i18n, [locale, code], null) as string | null;
  }
}
