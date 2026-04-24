import {
  collect,
  Either,
  Entity,
  IEntityProps,
  left,
  right,
  Text,
  ValidationError,
} from '../../../../shared';

export interface IProfessionalValueProps extends IEntityProps {
  icon: string;
  content: string;
}

export class ProfessionalValue extends Entity<
  ProfessionalValue,
  IProfessionalValueProps
> {
  static readonly ERROR_CODE = 'INVALID_PROFESSIONAL_VALUE';

  public readonly icon: Text;
  public readonly content: Text;

  private constructor(
    props: IProfessionalValueProps,
    icon: Text,
    content: Text,
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
      Text.create(props.content, { min: 1, max: 125000 }),
    ]);
    if (result.isLeft()) return left(result.value);

    const [icon, content] = result.value;
    return right(new ProfessionalValue(props, icon, content));
  }
}
