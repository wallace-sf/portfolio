import {
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
    const nameResult = Name.create(props.name);
    if (nameResult.isLeft()) return left(nameResult.value);

    const iconResult = Text.create(props.icon, { min: 2, max: 50 });
    if (iconResult.isLeft()) return left(iconResult.value);

    const urlResult = Url.create(props.url);
    if (urlResult.isLeft()) return left(urlResult.value);

    return right(
      new SocialNetwork(
        props,
        nameResult.value,
        iconResult.value,
        urlResult.value,
      ),
    );
  }
}
