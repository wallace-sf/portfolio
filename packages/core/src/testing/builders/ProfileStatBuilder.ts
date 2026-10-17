import { ILocalizedTextInput } from '../../index';
import {
  IProfileStatProps,
  ProfileStat,
} from '../../portfolio/entities/profile/model/ProfileStat';
import { unwrap } from '../unwrap';
import { EntityBuilder } from './EntityBuilder';

export class ProfileStatBuilder extends EntityBuilder<IProfileStatProps> {
  private constructor(props: IProfileStatProps) {
    super(props);
  }

  static build(): ProfileStatBuilder {
    return new ProfileStatBuilder({
      label: {
        'en-US': 'Years of experience',
        'pt-BR': 'Anos de experiência',
      },
      value: '5+',
      icon: 'briefcase',
    });
  }

  public now(): ProfileStat {
    return unwrap(ProfileStat.create(this._props as IProfileStatProps));
  }

  public withLabel(label: ILocalizedTextInput): ProfileStatBuilder {
    this._props.label = label;
    return this;
  }

  public withValue(value: string): ProfileStatBuilder {
    this._props.value = value;
    return this;
  }

  public withIcon(icon: string): ProfileStatBuilder {
    this._props.icon = icon;
    return this;
  }
}
