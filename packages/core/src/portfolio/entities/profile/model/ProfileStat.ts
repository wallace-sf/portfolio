import { Either, left, right, Text, ValidationError } from '../../../../shared';
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
    const labelResult = LocalizedText.create(props.label);
    if (labelResult.isLeft()) return left(labelResult.value);

    const valueResult = Text.create(props.value, { min: 1, max: 50 });
    if (valueResult.isLeft()) return left(valueResult.value);

    const iconResult = Text.create(props.icon, { min: 2, max: 50 });
    if (iconResult.isLeft()) return left(iconResult.value);

    return right(
      new ProfileStat(
        labelResult.value,
        valueResult.value.value,
        iconResult.value,
      ),
    );
  }
}
