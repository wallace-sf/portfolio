import {
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
    const iconResult = Text.create(props.icon, { min: 2, max: 50 });
    if (iconResult.isLeft()) return left(iconResult.value);

    const contentResult = Text.create(props.content, { min: 1, max: 125000 });
    if (contentResult.isLeft()) return left(contentResult.value);

    return right(
      new ProfessionalValue(props, iconResult.value, contentResult.value),
    );
  }
}
