import { ValidationError } from '@repo/utils';

import { SocialNetwork, Name } from '../../src';
import { SocialNetworkBuilder } from '../data';
describe('SocialNetwork', () => {
  it('should be valid when props are valid', () => {
    const socialNetwork = SocialNetworkBuilder.build().now();

    expect(socialNetwork).toBeInstanceOf(SocialNetwork);
  });

  it('should be invalid when name social network is invalid', () => {
    expect(() => SocialNetworkBuilder.build().withoutName().now()).toThrow(
      new ValidationError(Name.ERROR_CODE, 'Nome deve conter apenas letras.'),
    );
  });

  it('should create new language from valid props', () => {
    const socialNetwork = SocialNetworkBuilder.build()
      .withName('Linkedin')
      .withIcon('linkedin')
      .withUrl('https://www.linkedin.com')
      .now();

    expect(socialNetwork).toBeInstanceOf(SocialNetwork);
    expect(socialNetwork.name.value).toBe('Linkedin');
    expect(socialNetwork.icon.value).toBe('linkedin');
    expect(socialNetwork.url.value).toBe('https://www.linkedin.com');
  });

  it('should create multiple languages from valid props', () => {
    const socialNetworks = SocialNetworkBuilder.list(2);

    expect(socialNetworks).toHaveLength(2);
  });
});
