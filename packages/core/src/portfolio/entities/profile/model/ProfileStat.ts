import {
  collect,
  Either,
  left,
  right,
  Text,
  ValidationError,
} from '../../../../shared';
import {
  ILocalizedTextInput,
  LocalizedText,
} from '../../../../shared/i18n/LocalizedText';

export interface IProfileStatProps {
  label: ILocalizedTextInput;
  value: string;
  icon: string;
}

export class ProfileStat {
  public readonly label: LocalizedText;
  public readonly value: string;
  public readonly icon: Text;

  private constructor(label: LocalizedText, value: string, icon: Text) {
    this.label = label;
    this.value = value;
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

    const [label, value, icon] = result.value;
    return right(new ProfileStat(label, value.value, icon));
  }
}
