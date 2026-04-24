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

export interface IProfileStatProps extends IEntityProps {
  label: ILocalizedTextInput;
  value: string;
  icon: string;
}

export class ProfileStat extends Entity<ProfileStat, IProfileStatProps> {
  static readonly ERROR_CODE = 'INVALID_PROFILE_STAT';

  public readonly label: LocalizedText;
  public readonly value: string;
  public readonly icon: Text;

  private constructor(
    props: IProfileStatProps,
    label: LocalizedText,
    icon: Text,
  ) {
    super(props);
    this.label = label;
    this.value = props.value;
    this.icon = icon;
  }

  static create(
    props: IProfileStatProps,
  ): Either<ValidationError, ProfileStat> {
    const result = collect([
      LocalizedText.create(props.label),
      Text.create(props.value, { min: 1, max: 50 }),
      Text.create(props.icon, { min: 2, max: 50 }),
    ]);
    if (result.isLeft()) return left(result.value);

    const [label, , icon] = result.value;
    return right(new ProfileStat(props, label, icon));
  }
}
