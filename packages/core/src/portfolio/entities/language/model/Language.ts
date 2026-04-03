import { Validator } from '@repo/utils/validator';

import {
  collect,
  Either,
  Entity,
  IEntityProps,
  isLocale,
  left,
  Locale,
  LOCALES,
  Name,
  right,
  ValidationError,
} from '../../../../shared';
import { Fluency } from './Fluency';

export interface ILanguageProps extends IEntityProps {
  name: string;
  fluency: Fluency;
  locale: string;
}

export class Language extends Entity<Language, ILanguageProps> {
  static readonly LOCALE_ERROR_CODE = 'INVALID_LOCALE';

  public readonly name: Name;
  public readonly fluency: Fluency;
  public readonly locale: Locale;

  private constructor(props: ILanguageProps, name: Name, locale: Locale) {
    super(props);
    this.name = name;
    this.fluency = props.fluency;
    this.locale = locale;
  }

  static create(props: ILanguageProps): Either<ValidationError, Language> {
    const { error: fluencyError, isValid: fluencyValid } = Validator.of(
      props.fluency,
    )
      .in(Object.values(Fluency), 'Invalid fluency level.')
      .validate();
    if (!fluencyValid && fluencyError)
      return left(
        new ValidationError({
          code: 'INVALID_FLUENCY',
          message: fluencyError,
        }),
      );

    const result = collect([
      Name.create(props.name),
      Language._createLocale(props.locale),
    ]);
    if (result.isLeft()) return left(result.value);

    const [name, locale] = result.value;
    return right(new Language(props, name, locale as Locale));
  }

  private static _createLocale(value: string): Either<ValidationError, Locale> {
    const { error, isValid } = Validator.of(value)
      .refine(
        (v) => isLocale(v),
        `Locale must be one of: ${LOCALES.join(', ')}.`,
      )
      .validate();
    if (!isValid && error)
      return left(
        new ValidationError({
          code: Language.LOCALE_ERROR_CODE,
          message: error,
        }),
      );
    return right(value as Locale);
  }
}
