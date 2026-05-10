import {
  collect,
  Either,
  Entity,
  IEntityProps,
  ILocalizedTextInput,
  left,
  LocalizedText,
  right,
  Text,
  ValidationError,
} from '../../../../shared';

export interface IProfessionalValueProps extends IEntityProps {
  icon: string;
  content: ILocalizedTextInput;
}

export class ProfessionalValue extends Entity<
  ProfessionalValue,
  IProfessionalValueProps
> {
  static readonly ERROR_CODE = 'INVALID_PROFESSIONAL_VALUE';

  public readonly icon: Text;
  public readonly content: LocalizedText;

  private constructor(
    props: IProfessionalValueProps,
    icon: Text,
    content: LocalizedText,
  ) {
    super(props);
    this.icon = icon;
    this.content = content;
  }

  static create(
    props: IProfessionalValueProps,
  ): Either<ValidationError, ProfessionalValue> {
    const result = collect([
      Text.create(props.icon, { min: 2, max: 50 }),
      LocalizedText.create(props.content),
    ]);
    if (result.isLeft()) return left(result.value);

    const [icon, content] = result.value as [Text, LocalizedText];
    return right(new ProfessionalValue(props, icon, content));
  }
}
