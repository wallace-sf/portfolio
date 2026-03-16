import { Validator } from '@repo/utils/validator';

import {
  collect,
  Either,
  Entity,
  IEntityProps,
  Image,
  left,
  Name,
  right,
  Slug,
  ValidationError,
} from '../../../../shared';
import {
  ILocalizedTextInput,
  LocalizedText,
} from '../../../../shared/i18n/LocalizedText';
import { IProfileStatProps, ProfileStat } from './ProfileStat';

export interface IProfileProps extends IEntityProps {
  name: string;
  headline: ILocalizedTextInput;
  bio: ILocalizedTextInput;
  photo: { url: string; alt: ILocalizedTextInput };
  stats: IProfileStatProps[];
  featuredProjectSlugs: string[];
}

export class Profile extends Entity<Profile, IProfileProps> {
  static readonly ERROR_CODE = 'TOO_MANY_FEATURED_PROJECTS';
  private static readonly MAX_FEATURED_PROJECTS = 6;

  public readonly name: Name;
  public readonly headline: LocalizedText;
  public readonly bio: LocalizedText;
  public readonly photo: Image;
  public readonly stats: ProfileStat[];
  public readonly featuredProjectSlugs: Slug[];

  private constructor(
    props: IProfileProps,
    name: Name,
    headline: LocalizedText,
    bio: LocalizedText,
    photo: Image,
    stats: ProfileStat[],
    featuredProjectSlugs: Slug[],
  ) {
    super(props);
    this.name = name;
    this.headline = headline;
    this.bio = bio;
    this.photo = photo;
    this.stats = stats;
    this.featuredProjectSlugs = featuredProjectSlugs;
  }

  static create(props: IProfileProps): Either<ValidationError, Profile> {
    const { error, isValid } = Validator.of(props.featuredProjectSlugs)
      .refine(
        (slugs) => slugs.length <= Profile.MAX_FEATURED_PROJECTS,
        `Maximum ${Profile.MAX_FEATURED_PROJECTS} featured projects allowed, got ${props.featuredProjectSlugs.length}.`,
      )
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: Profile.ERROR_CODE, message: error }),
      );

    const requiredResult = collect([
      Name.create(props.name),
      LocalizedText.create(props.headline),
      LocalizedText.create(props.bio),
      Image.create(props.photo.url, props.photo.alt),
    ]);
    if (requiredResult.isLeft()) return left(requiredResult.value);

    const [name, headline, bio, photo] = requiredResult.value;

    const stats: ProfileStat[] = [];
    for (const statProps of props.stats) {
      const statResult = ProfileStat.create(statProps);
      if (statResult.isLeft()) return left(statResult.value);
      stats.push(statResult.value);
    }

    const slugs: Slug[] = [];
    for (const slugStr of props.featuredProjectSlugs) {
      const slugResult = Slug.create(slugStr);
      if (slugResult.isLeft()) return left(slugResult.value);
      slugs.push(slugResult.value);
    }

    return right(new Profile(props, name, headline, bio, photo, stats, slugs));
  }
}
