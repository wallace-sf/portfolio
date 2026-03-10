import { IProfileProps, Profile } from '../../src';
import { IProfileStatProps } from '../../src/portfolio/entities/profile/model/ProfileStat';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';

export class ProfileBuilder extends EntityBuilder<IProfileProps> {
  private constructor(props: IProfileProps) {
    super(props);
  }

  static build(): ProfileBuilder {
    return new ProfileBuilder({
      name: 'Wallace',
      headline: { 'pt-BR': 'Engenheiro de Software' },
      bio: { 'pt-BR': 'Desenvolvedor apaixonado por DDD e Clean Architecture.' },
      photo: { url: Data.image.url(), alt: Data.image.alt() },
      stats: [
        { label: { 'pt-BR': 'Anos de experiência' }, value: '5+', icon: 'briefcase' },
      ],
      featuredProjectSlugs: ['my-project', 'portfolio-app'],
    });
  }

  public now(): Profile {
    const result = Profile.create(this._props as IProfileProps);
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  public withName(name: string): ProfileBuilder {
    this._props.name = name;
    return this;
  }

  public withHeadline(headline: IProfileProps['headline']): ProfileBuilder {
    this._props.headline = headline;
    return this;
  }

  public withBio(bio: IProfileProps['bio']): ProfileBuilder {
    this._props.bio = bio;
    return this;
  }

  public withStats(stats: IProfileStatProps[]): ProfileBuilder {
    this._props.stats = stats;
    return this;
  }

  public withFeaturedProjectSlugs(slugs: string[]): ProfileBuilder {
    this._props.featuredProjectSlugs = slugs;
    return this;
  }
}
