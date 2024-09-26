import { Language, ILanguageProps, FluencyValue } from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';

export class LanguageBuilder extends EntityBuilder<ILanguageProps> {
  private constructor(props: ILanguageProps) {
    super(props);
  }

  static build(): LanguageBuilder {
    return new LanguageBuilder({
      name: Data.text.language(),
      fluency: Data.fluency.valid(),
      locale: Data.text.locale(),
    });
  }

  public now(): Language {
    return new Language(this._props as ILanguageProps);
  }

  static list(count: number): Language[] {
    return [...Array(count)].map(() => LanguageBuilder.build().now());
  }

  public withName(name: string): LanguageBuilder {
    this._props.name = name;

    return this;
  }

  public withFluency(fluency: FluencyValue): LanguageBuilder {
    this._props.fluency = fluency;

    return this;
  }

  public withLocale(locale: string): LanguageBuilder {
    this._props.locale = locale;

    return this;
  }

  public withoutName(): LanguageBuilder {
    this._props.name = undefined;

    return this;
  }

  public withoutFluency(): LanguageBuilder {
    this._props.fluency = undefined;

    return this;
  }

  public withoutLocale(): LanguageBuilder {
    this._props.locale = undefined;

    return this;
  }
}
