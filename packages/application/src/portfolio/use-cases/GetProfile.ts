import { IProfileRepository, Profile, ProfileStat } from '@repo/core/portfolio';
import {
  DomainError,
  Either,
  Locale,
  NotFoundError,
  left,
  right,
} from '@repo/core/shared';

import { ProfileDTO } from '~/portfolio/dtos/ProfileDTO';
import { ProfileStatDTO } from '~/portfolio/dtos/ProfileStatDTO';
import { SocialNetworkDTO } from '~/portfolio/dtos/SocialNetworkDTO';
import { UseCase } from '~/shared/UseCase';

export type GetProfileInput = {
  locale: Locale;
};

export class GetProfile extends UseCase<
  GetProfileInput,
  ProfileDTO,
  NotFoundError | DomainError
> {
  constructor(private readonly profileRepository: IProfileRepository) {
    super();
  }

  async execute(
    input: GetProfileInput,
  ): Promise<Either<NotFoundError | DomainError, ProfileDTO>> {
    try {
      const profile = await this.profileRepository.find();
      if (!profile) return left(new NotFoundError());
      return right(this.toDTO(profile, input.locale));
    } catch {
      return left(
        new DomainError('FETCH_FAILED', { message: 'Failed to fetch profile' }),
      );
    }
  }

  private toDTO(profile: Profile, locale: Locale): ProfileDTO {
    return {
      id: profile.id.value,
      name: profile.name.value,
      headline: profile.headline.get(locale),
      bio: profile.bio.get(locale),
      photo: {
        url: profile.photo.url.value,
        alt: profile.photo.alt.get(locale),
      },
      stats: profile.stats.map((s) => this.toStatDTO(s, locale)),
      featuredProjectSlugs: profile.featuredProjectSlugs.map((s) => s.value),
      socialNetworks: [] as SocialNetworkDTO[],
    };
  }

  private toStatDTO(stat: ProfileStat, locale: Locale): ProfileStatDTO {
    return {
      label: stat.label.get(locale),
      value: stat.value,
      icon: stat.icon.value,
    };
  }
}
