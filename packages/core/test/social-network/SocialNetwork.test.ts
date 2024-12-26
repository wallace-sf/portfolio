import { ValidationError } from '@repo/utils';

import { SocialNetwork, Name, Text, Url } from '../../src';
import { SocialNetworkBuilder } from '../data';
describe('SocialNetwork', () => {
  it('should be valid when props are valid', () => {
    const socialNetwork = SocialNetworkBuilder.build().now();

    expect(socialNetwork).toBeInstanceOf(SocialNetwork);
  });

  it('should be invalid when name is invalid', () => {
    expect(() => SocialNetworkBuilder.build().withoutName().now()).toThrow(
      new ValidationError(Name.ERROR_CODE, 'Nome deve conter apenas letras.'),
    );
  });

  it('should be invalid when icon is invalid', () => {
    expect(() => SocialNetworkBuilder.build().withoutIcon().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 2 e 50 caracteres.',
      ),
    );
  });

  it('should be invalid when url is invalid', () => {
    expect(() => SocialNetworkBuilder.build().withoutUrl().now()).toThrow(
      new ValidationError(Url.ERROR_CODE, 'O valor deve ser uma URL válida.'),
    );
  });

  it('should create new language from valid props', () => {
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

  it('should create multiple languages from valid props', () => {
    const socialNetworks = SocialNetworkBuilder.list(2);

    expect(socialNetworks).toHaveLength(2);
  });
});
