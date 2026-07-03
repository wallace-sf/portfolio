import { LocalizedText, Name, ValidationError } from '~/index';
import { Profile } from '~/portfolio/entities/profile/model/Profile';
import { ProfileStat } from '~/portfolio/entities/profile/model/ProfileStat';

import { Data } from '../helpers/generators';

const validStat = {
  label: { 'en-US': 'Years of experience', 'pt-BR': 'Anos de experiência' },
  value: '5+',
  icon: 'briefcase',
};

const validProps = {
  name: 'Wallace',
  headline: { 'en-US': 'Software Engineer', 'pt-BR': 'Engenheiro de Software' },
  bio: {
    'en-US': 'Developer passionate about DDD and Clean Architecture.',
    'pt-BR': 'Desenvolvedor apaixonado por DDD e Clean Architecture.',
  },
  photo: {
    url: Data.image.url(),
    alt: Data.image.alt(),
  },
  stats: [validStat],
};

describe('Profile', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid Profile', () => {
      const result = Profile.create(validProps);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Profile);
    });

    it('should expose all fields as domain objects', () => {
      const result = Profile.create(validProps);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.name).toBeInstanceOf(Name);
      expect(result.value.headline).toBeInstanceOf(LocalizedText);
      expect(result.value.bio).toBeInstanceOf(LocalizedText);
      expect(result.value.stats).toHaveLength(1);
      expect(result.value.stats[0]).toBeInstanceOf(ProfileStat);
    });

    it('should allow profile with empty stats', () => {
      const result = Profile.create({ ...validProps, stats: [] });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.stats).toHaveLength(0);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when name is invalid', () => {
      const result = Profile.create({ ...validProps, name: '' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Name.ERROR_CODE);
    });

    it('should return Left when headline en-US is empty', () => {
      const result = Profile.create({
        ...validProps,
        headline: { 'en-US': '' },
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when bio en-US is empty', () => {
      const result = Profile.create({
        ...validProps,
        bio: { 'en-US': '' },
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when photo URL is invalid', () => {
      const result = Profile.create({
        ...validProps,
        photo: { url: 'not-a-url', alt: Data.image.alt() },
      });

      expect(result.isLeft()).toBe(true);
    });

    it('should propagate stat validation errors', () => {
      const result = Profile.create({
        ...validProps,
        stats: [{ ...validStat, icon: '' }],
      });

      expect(result.isLeft()).toBe(true);
    });
  });
});
