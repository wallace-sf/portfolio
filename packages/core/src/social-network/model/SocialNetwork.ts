import { Entity, IEntityProps, Name, Text, Url } from '../../shared';

export interface ISocialNetworkProps extends IEntityProps {
  name: string;
  icon: string;
  url: string;
}

export class SocialNetwork extends Entity<SocialNetwork, ISocialNetworkProps> {
  public readonly name: Name;
  public readonly icon: Text;
  public readonly url: Url;

  constructor(props: ISocialNetworkProps) {
    super(props);
    this.name = Name.new(props.name);
    this.icon = Text.new(props.icon, { min: 2, max: 50 });
    this.url = Url.new(props.url);
  }
}
