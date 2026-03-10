import {
  Either,
  Entity,
  Fluency,
  FluencyValue,
  IEntityProps,
  left,
  Name,
  right,
  Text,
  ValidationError,
} from '../../../../shared';

export interface ILanguageProps extends IEntityProps {
  name: string;
  fluency: FluencyValue;
  locale: string;
}

export class Language extends Entity<Language, ILanguageProps> {
  public readonly name: Name;
  public readonly fluency: Fluency;
  public readonly locale: Text;

  private constructor(
    props: ILanguageProps,
    name: Name,
    fluency: Fluency,
    locale: Text,
  ) {
    super(props);
    this.name = name;
    this.fluency = fluency;
    this.locale = locale;
  }

  static create(props: ILanguageProps): Either<ValidationError, Language> {
    const nameResult = Name.create(props.name);
    if (nameResult.isLeft()) return left(nameResult.value);

    const fluencyResult = Fluency.create(props.fluency);
    if (fluencyResult.isLeft()) return left(fluencyResult.value);

    const localeResult = Text.create(props.locale, { min: 2, max: 50 });
    if (localeResult.isLeft()) return left(localeResult.value);

    return right(
      new Language(
        props,
        nameResult.value,
        fluencyResult.value,
        localeResult.value,
      ),
    );
  }
}
