import { ProfileStatDTO } from '~/portfolio/dtos/ProfileStatDTO';
import { SocialNetworkDTO } from '~/portfolio/dtos/SocialNetworkDTO';

export type ProfileDTO = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  photo: { url: string; alt: string };
  stats: ProfileStatDTO[];
  featuredProjectSlugs: string[];
  socialNetworks: SocialNetworkDTO[];
};
