import { Name, SocialNetwork, Text, Url, ValidationError } from '../../src';
import { SocialNetworkBuilder } from '../helpers';

describe('SocialNetwork', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid SocialNetwork', () => {
      const result = SocialNetwork.create(SocialNetworkBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(SocialNetwork);
    });

    it('should create social network with all fields as VOs', () => {
      const name = 'Linkedin';
      const icon = 'linkedin';
      const url = 'https://www.linkedin.com';

      const result = SocialNetwork.create(
        SocialNetworkBuilder.build()
          .withName(name)
          .withIcon(icon)
          .withUrl(url)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.name.value).toBe(name);
      expect(result.value.icon.value).toBe(icon);
      expect(result.value.url.value).toBe(url);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when name is invalid', () => {
      const result = SocialNetwork.create(
        SocialNetworkBuilder.build().withoutName().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Name.ERROR_CODE);
    });

    it('should return Left when icon is invalid', () => {
      const result = SocialNetwork.create(
        SocialNetworkBuilder.build().withoutIcon().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when url is invalid', () => {
      const result = SocialNetwork.create(
        SocialNetworkBuilder.build().withoutUrl().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Url.ERROR_CODE);
    });
  });
});
