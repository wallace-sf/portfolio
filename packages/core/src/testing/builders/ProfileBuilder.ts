import { IProfileProps, Profile } from '../../index';
import { IProfileStatProps } from '../../portfolio/entities/profile/model/ProfileStat';
import { Data } from '../generators';
import { unwrap } from '../unwrap';
import { EntityBuilder } from './EntityBuilder';

export class ProfileBuilder extends EntityBuilder<IProfileProps> {
  private constructor(props: IProfileProps) {
    super(props);
  }

  static build(): ProfileBuilder {
    return new ProfileBuilder({
      name: 'Wallace',
      headline: {
        'en-US': 'Software Engineer',
        'pt-BR': 'Engenheiro de Software',
      },
      bio: {
        'en-US': 'Developer passionate about DDD and Clean Architecture.',
        'pt-BR': 'Desenvolvedor apaixonado por DDD e Clean Architecture.',
      },
      photo: { url: Data.image.url(), alt: Data.image.alt() },
      stats: [
        {
          label: {
            'en-US': 'Years of experience',
            'pt-BR': 'Anos de experiência',
          },
          value: '5+',
          icon: 'briefcase',
        },
      ],
    });
  }

  public now(): Profile {
    return unwrap(Profile.create(this._props as IProfileProps));
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

  public withPhoto(photo: IProfileProps['photo']): ProfileBuilder {
    this._props.photo = photo;
    return this;
  }

  public withStats(stats: IProfileStatProps[]): ProfileBuilder {
    this._props.stats = stats;
    return this;
  }
}
