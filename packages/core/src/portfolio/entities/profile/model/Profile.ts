import {
  Either,
  collect,
  AggregateRoot,
  IEntityProps,
  Image,
  left,
  Name,
  right,
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
}

export class Profile extends AggregateRoot<Profile, IProfileProps> {
  public readonly name: Name;
  public readonly headline: LocalizedText;
  public readonly bio: LocalizedText;
  public readonly photo: Image;
  public readonly stats: ProfileStat[];

  private constructor(
    props: IProfileProps,
    name: Name,
    headline: LocalizedText,
    bio: LocalizedText,
    photo: Image,
    stats: ProfileStat[],
  ) {
    super(props);
    this.name = name;
    this.headline = headline;
    this.bio = bio;
    this.photo = photo;
    this.stats = stats;
  }

  static create(props: IProfileProps): Either<ValidationError, Profile> {
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

    return right(new Profile(props, name, headline, bio, photo, stats));
  }
}
