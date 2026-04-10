import {
  collect,
  Either,
  Entity,
  IEntityProps,
  left,
  Name,
  right,
  Text,
  Url,
  ValidationError,
} from '../../../../shared';

export interface ISocialNetworkProps extends IEntityProps {
  name: string;
  icon: string;
  url: string;
}

export class SocialNetwork extends Entity<SocialNetwork, ISocialNetworkProps> {
  static readonly ERROR_CODE = 'INVALID_SOCIAL_NETWORK';

  public readonly name: Name;
  public readonly icon: Text;
  public readonly url: Url;

  private constructor(
    props: ISocialNetworkProps,
    name: Name,
    icon: Text,
    url: Url,
  ) {
    super(props);
    this.name = name;
    this.icon = icon;
    this.url = url;
  }

  static create(
    props: ISocialNetworkProps,
  ): Either<ValidationError, SocialNetwork> {
    const result = collect([
      Name.create(props.name),
      Text.create(props.icon, { min: 2, max: 50 }),
      Url.create(props.url),
    ]);
    if (result.isLeft()) return left(result.value);

    const [name, icon, url] = result.value;
    return right(new SocialNetwork(props, name, icon, url));
  }
}
