import {
  collect,
  Either,
  ILocalizedTextInput,
  LocalizedText,
  PersonName,
  Url,
  ValidationError,
  ValueObject,
  left,
  right,
} from '../../shared';

export interface IAuthorProps {
  name: string;
  avatarUrl: string;
  url?: string;
  bio?: ILocalizedTextInput;
}

interface IAuthorValue {
  name: PersonName;
  avatarUrl: Url;
  url: Url | undefined;
  bio: LocalizedText | undefined;
}

export class Author extends ValueObject<IAuthorValue> {
  static readonly ERROR_CODE = 'INVALID_AUTHOR';

  private constructor(value: IAuthorValue) {
    super({ value });
  }

  static create(props: IAuthorProps): Either<ValidationError, Author> {
    const fieldsResult = collect([
      PersonName.create(props.name),
      Url.create(props.avatarUrl),
      props.url
        ? Url.create(props.url)
        : right<ValidationError, Url | undefined>(undefined),
      props.bio
        ? LocalizedText.create(props.bio)
        : right<ValidationError, LocalizedText | undefined>(undefined),
    ]);
    if (fieldsResult.isLeft()) return left(fieldsResult.value);

    const [name, avatarUrl, url, bio] = fieldsResult.value;

    return right(
      new Author({
        name: name as PersonName,
        avatarUrl: avatarUrl as Url,
        url: url as Url | undefined,
        bio: bio as LocalizedText | undefined,
      }),
    );
  }

  get name(): PersonName {
    return this.value.name;
  }

  get avatarUrl(): Url {
    return this.value.avatarUrl;
  }

  get url(): Url | undefined {
    return this.value.url;
  }

  get bio(): LocalizedText | undefined {
    return this.value.bio;
  }
}
