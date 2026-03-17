import { Validator } from '@repo/utils/validator';

import {
  collect,
  Either,
  Entity,
  Fluency,
  FluencyValue,
  IEntityProps,
  isLocale,
  left,
  Locale,
  LOCALES,
  Name,
  right,
  ValidationError,
} from '../../../../shared';

export interface ILanguageProps extends IEntityProps {
  name: string;
  fluency: FluencyValue;
  locale: string;
}

export class Language extends Entity<Language, ILanguageProps> {
  static readonly LOCALE_ERROR_CODE = 'INVALID_LOCALE';

  public readonly name: Name;
  public readonly fluency: Fluency;
  public readonly locale: Locale;

  private constructor(
    props: ILanguageProps,
    name: Name,
    fluency: Fluency,
    locale: Locale,
  ) {
    super(props);
    this.name = name;
    this.fluency = fluency;
    this.locale = locale;
  }

  static create(props: ILanguageProps): Either<ValidationError, Language> {
    const result = collect([
      Name.create(props.name),
      Fluency.create(props.fluency),
      Language._createLocale(props.locale),
    ]);
    if (result.isLeft()) return left(result.value);

    const [name, fluency, locale] = result.value;
    return right(new Language(props, name, fluency, locale as Locale));
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
