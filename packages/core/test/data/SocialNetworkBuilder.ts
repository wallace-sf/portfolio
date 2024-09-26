import { faker } from '@faker-js/faker';

import { ISocialNetworkProps, SocialNetwork } from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';

export class SocialNetworkBuilder extends EntityBuilder<ISocialNetworkProps> {
  private constructor(props: ISocialNetworkProps) {
    super(props);
  }

  static build(): SocialNetworkBuilder {
    return new SocialNetworkBuilder({
      name: Data.name.socialNetwork(),
      icon: faker.internet.url(),
      url: faker.internet.url(),
    });
  }

  public now(): SocialNetwork {
    return new SocialNetwork(this._props as ISocialNetworkProps);
  }

  static list(count: number): SocialNetwork[] {
    return [...Array(count)].map(() => SocialNetworkBuilder.build().now());
  }

  public withName(name: string): SocialNetworkBuilder {
    this._props.name = name;

    return this;
  }

  public withIcon(icon: string): SocialNetworkBuilder {
    this._props.icon = icon;

    return this;
  }

  public withUrl(url: string): SocialNetworkBuilder {
    this._props.url = url;

    return this;
  }

  public withoutName(): SocialNetworkBuilder {
    this._props.name = undefined;

    return this;
  }

  public withoutIcon(): SocialNetworkBuilder {
    this._props.icon = undefined;

    return this;
  }

  public withoutUrl(): SocialNetworkBuilder {
    this._props.url = undefined;

    return this;
  }
}
