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
  validateEnum,
} from '../../../../shared';
import { Fluency } from './Fluency';

export interface ILanguageProps extends IEntityProps {
  name: string;
  fluency: Fluency;
  locale: string;
}

export class Language extends Entity<Language, ILanguageProps> {
  static readonly ERROR_CODE = 'INVALID_LANGUAGE';
  static readonly LOCALE_ERROR_CODE = 'INVALID_LOCALE';

  public readonly name: Name;
  public readonly fluency: Fluency;
  public readonly locale: Locale;

  private constructor(
    props: ILanguageProps,
    fluency: Fluency,
    name: Name,
    locale: Locale,
  ) {
    super(props);
    this.fluency = fluency;
    this.name = name;
    this.locale = locale;
  }

  static create(props: ILanguageProps): Either<ValidationError, Language> {
    const result = collect([
      validateEnum(
        props.fluency,
        Object.values(Fluency),
        Language.ERROR_CODE,
        'Invalid fluency level.',
      ),
      Name.create(props.name),
      Language._createLocale(props.locale),
    ]);
    if (result.isLeft()) return left(result.value);

    const [fluency, name, locale] = result.value;
    return right(new Language(props, fluency, name, locale as Locale));
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
