import { SocialNetwork, Name, Text, Url, ValidationError } from '../../src';
import { SocialNetworkBuilder } from '../data';

describe('SocialNetwork', () => {
  it('should be valid when props are valid', () => {
    const socialNetwork = SocialNetworkBuilder.build().now();

    expect(socialNetwork).toBeInstanceOf(SocialNetwork);
  });

  it('should be invalid when name is invalid', () => {
    expect(() => SocialNetworkBuilder.build().withoutName().now()).toThrow(
      new ValidationError({ code: Name.ERROR_CODE, message: 'The name must contain only letters.' }),
    );
  });

  it('should be invalid when icon is invalid', () => {
    expect(() => SocialNetworkBuilder.build().withoutIcon().now()).toThrow(
      new ValidationError({
        code: Text.ERROR_CODE,
        message: 'The value must be between 2 and 50 characters.',
      }),
    );
  });

  it('should be invalid when url is invalid', () => {
    expect(() => SocialNetworkBuilder.build().withoutUrl().now()).toThrow(
      new ValidationError({ code: Url.ERROR_CODE, message: 'The value must be a valid URL.' }),
    );
  });

  it('should create new social network from valid props', () => {
    const name = 'Linkedin';
    const icon = 'linkedin';
    const url = 'https://www.linkedin.com';

    const socialNetwork = SocialNetworkBuilder.build()
      .withName(name)
      .withIcon(icon)
      .withUrl(url)
      .now();

    expect(socialNetwork).toBeInstanceOf(SocialNetwork);
    expect(socialNetwork.name.value).toBe(name);
    expect(socialNetwork.icon.value).toBe(icon);
    expect(socialNetwork.url.value).toBe(url);
  });

  it('should create multiple social networks', () => {
    const socialNetworks = SocialNetworkBuilder.list(2);

    expect(socialNetworks).toHaveLength(2);
  });
});
