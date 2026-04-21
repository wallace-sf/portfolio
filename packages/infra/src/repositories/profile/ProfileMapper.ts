import { Prisma } from '@prisma/client';

import { IProfileProps, IProfileStatProps, Profile } from '@repo/core/portfolio';
import { ILocalizedTextInput } from '@repo/core/shared';

import { InfrastructureError } from '~/errors/InfrastructureError';

type PrismaProfileWithRelations = Prisma.ProfileGetPayload<{
  include: {
    stats: true;
    socialNetworks: true;
  };
}>;

type ProfileStatData = {
  label: Prisma.InputJsonValue;
  value: string;
  icon: string;
  order: number;
};

export class ProfileMapper {
  static toDomain(raw: PrismaProfileWithRelations): Profile {
    const asLocalized = (v: unknown) => v as ILocalizedTextInput;

    const stats: IProfileStatProps[] = raw.stats
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        label: asLocalized(s.label),
        value: s.value,
        icon: s.icon,
      }));

    const props: IProfileProps = {
      id: raw.id,
      name: raw.name,
      headline: asLocalized(raw.headline),
      bio: asLocalized(raw.bio),
      photo: {
        url: raw.photoUrl,
        alt: asLocalized(raw.photoAlt),
      },
      stats,
      featuredProjectSlugs: raw.featuredProjectSlugs,
      created_at: raw.createdAt.toISOString(),
      updated_at: raw.updatedAt.toISOString(),
    };

    const result = Profile.create(props);
    if (result.isLeft()) {
      throw new InfrastructureError(
        `Failed to map profile ${raw.id} to domain: ${result.value.message}`,
        result.value,
      );
    }

    return result.value;
  }

  static toPrisma(
    profile: Profile,
  ): Omit<Prisma.ProfileUncheckedCreateInput, 'stats' | 'socialNetworks'> & {
    stats: ProfileStatData[];
  } {
    return {
      id: profile.id.value,
      name: profile.name.value,
      headline: profile.headline.value,
      bio: profile.bio.value,
      photoUrl: profile.photo.url.value,
      photoAlt: profile.photo.alt.value,
      featuredProjectSlugs: profile.featuredProjectSlugs.map((s) => s.value),
      createdAt: new Date(profile.created_at.value),
      updatedAt: new Date(profile.updated_at.value),
      stats: profile.stats.map((s, index) => ({
        label: s.label.value,
        value: s.value,
        icon: s.icon.value,
        order: index,
      })),
    };
  }
}
