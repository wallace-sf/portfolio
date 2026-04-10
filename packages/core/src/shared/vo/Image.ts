import { ValueObject } from '~/shared/base/ValueObject';
import { left, right, Either } from '~/shared/either';
import { ValidationError } from '~/shared/errors';
import {
  ILocalizedTextInput,
  LocalizedText,
} from '~/shared/i18n/LocalizedText';
import { Url } from '~/shared/vo/Url';

interface IImageValue {
  url: Url;
  alt: LocalizedText;
}

export class Image extends ValueObject<IImageValue> {
  static readonly ERROR_CODE_URL = 'INVALID_URL';
  static readonly ERROR_CODE_ALT = 'INVALID_LOCALIZED_TEXT';

  private constructor(url: Url, alt: LocalizedText) {
    super({ value: { url, alt } } as { value: IImageValue });
  }

  static create(
    urlStr: string,
    alt: ILocalizedTextInput,
  ): Either<ValidationError, Image> {
    const urlResult = Url.create(urlStr);
    if (urlResult.isLeft()) return left(urlResult.value);

    const altResult = LocalizedText.create(alt);
    if (altResult.isLeft()) return left(altResult.value);

    return right(new Image(urlResult.value, altResult.value));
  }

  get url(): Url {
    return this.value.url;
  }

  get alt(): LocalizedText {
    return this.value.alt;
  }
}
