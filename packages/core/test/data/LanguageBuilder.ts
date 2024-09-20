import { faker } from '@faker-js/faker';

import { Language, ILanguageProps } from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';

export class LanguageBuilder extends EntityBuilder<ILanguageProps> {
  private constructor(props: ILanguageProps) {
    super(props);
  }

  static build(): LanguageBuilder {
    return new LanguageBuilder({
      name: Data.language.valid(),
      fluency: faker.lorem.word({ length: 3 }),
    });
  }

  public now(): Language {
    return new Language(this._props as ILanguageProps);
  }

  static list(count: number) {
    return [...Array(count)].map(() => LanguageBuilder.build());
  }

  public withName(name: string): LanguageBuilder {
    this._props.name = name;

    return this;
  }

  public withFluency(fluency: string): LanguageBuilder {
    this._props.fluency = fluency;

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
}
