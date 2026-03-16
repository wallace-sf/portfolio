import {
  collect,
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
    const result = collect([
      Name.create(props.name),
      Fluency.create(props.fluency),
      Text.create(props.locale, { min: 2, max: 50 }),
    ]);
    if (result.isLeft()) return left(result.value);

    const [name, fluency, locale] = result.value;
    return right(new Language(props, name, fluency, locale));
  }
}
