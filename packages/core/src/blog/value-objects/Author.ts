import { Validator } from '@repo/utils/validator';

import {
  collect,
  Either,
  ILocalizedTextInput,
  LocalizedText,
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
  name: string;
  avatarUrl: Url;
  url: Url | undefined;
  bio: LocalizedText | undefined;
}

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;

export class Author extends ValueObject<IAuthorValue> {
  static readonly ERROR_CODE = 'INVALID_AUTHOR';

  private constructor(value: IAuthorValue) {
    super({ value });
  }

  static create(props: IAuthorProps): Either<ValidationError, Author> {
    const name = props.name?.trim() ?? '';

    const { isValid } = Validator.of(name)
      .length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
      .validate();
    if (!isValid) return left(new ValidationError({ code: Author.ERROR_CODE }));

    const fieldsResult = collect([
      Url.create(props.avatarUrl),
      props.url
        ? Url.create(props.url)
        : right<ValidationError, Url | undefined>(undefined),
      props.bio
        ? LocalizedText.create(props.bio)
        : right<ValidationError, LocalizedText | undefined>(undefined),
    ]);
    if (fieldsResult.isLeft()) return left(fieldsResult.value);

    const [avatarUrl, url, bio] = fieldsResult.value;

    return right(
      new Author({
        name,
        avatarUrl,
        url: url as Url | undefined,
        bio: bio as LocalizedText | undefined,
      }),
    );
  }

  get name(): string {
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
