import { IProfessionalValueProps, ProfessionalValue } from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';

// eslint-disable-next-line max-len
export class ProfessionalValueBuilder extends EntityBuilder<IProfessionalValueProps> {
  private constructor(props: IProfessionalValueProps) {
    super(props);
  }

  static build(): ProfessionalValueBuilder {
    return new ProfessionalValueBuilder({
      icon: Data.text.icon(),
      content: Data.text.text(),
    });
  }

  public now(): ProfessionalValue {
    return new ProfessionalValue(this._props as IProfessionalValueProps);
  }

  static list(count: number): ProfessionalValue[] {
    return [...Array(count)].map(() => ProfessionalValueBuilder.build().now());
  }

  public withIcon(icon: string): ProfessionalValueBuilder {
    this._props.icon = icon;

    return this;
  }

  public withContent(content: string): ProfessionalValueBuilder {
    this._props.content = content;

    return this;
  }

  public withoutIcon(): ProfessionalValueBuilder {
    this._props.icon = undefined;

    return this;
  }

  public withoutContent(): ProfessionalValueBuilder {
    this._props.content = undefined;

    return this;
  }
}
