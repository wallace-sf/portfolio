import {
  LocalizedText,
  Name,
  Slug,
  ValidationError,
} from '../../src';
import { Profile } from '../../src/portfolio/entities/profile/model/Profile';
import { ProfileStat } from '../../src/portfolio/entities/profile/model/ProfileStat';
import { Data } from '../data/bases';

const validStat = {
  label: { 'pt-BR': 'Anos de experiência' },
  value: '5+',
  icon: 'briefcase',
};

const validProps = {
  name: 'Wallace',
  headline: { 'pt-BR': 'Engenheiro de Software' },
  bio: { 'pt-BR': 'Desenvolvedor apaixonado por DDD e Clean Architecture.' },
  photo: {
    url: Data.image.url(),
    alt: Data.image.alt(),
  },
  stats: [validStat],
  featuredProjectSlugs: ['my-project', 'portfolio-app'],
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
      expect(result.value.featuredProjectSlugs).toHaveLength(2);
      expect(result.value.featuredProjectSlugs[0]).toBeInstanceOf(Slug);
    });

    it('should allow profile with exactly 6 featured projects', () => {
      const result = Profile.create({
        ...validProps,
        featuredProjectSlugs: [
          'project-one',
          'project-two',
          'project-three',
          'project-four',
          'project-five',
          'project-six',
        ],
      });

      expect(result.isRight()).toBe(true);
    });

    it('should allow profile with zero featured projects', () => {
      const result = Profile.create({
        ...validProps,
        featuredProjectSlugs: [],
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.featuredProjectSlugs).toHaveLength(0);
    });

    it('should allow profile with empty stats', () => {
      const result = Profile.create({ ...validProps, stats: [] });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.stats).toHaveLength(0);
    });
  });

  describe('when invariant is violated', () => {
    it('should return Left when featured projects exceed 6', () => {
      const result = Profile.create({
        ...validProps,
        featuredProjectSlugs: [
          'project-one',
          'project-two',
          'project-three',
          'project-four',
          'project-five',
          'project-six',
          'project-seven',
        ],
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        'TOO_MANY_FEATURED_PROJECTS',
      );
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when name is invalid', () => {
      const result = Profile.create({ ...validProps, name: '' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Name.ERROR_CODE);
    });

    it('should return Left when headline pt-BR is empty', () => {
      const result = Profile.create({
        ...validProps,
        headline: { 'pt-BR': '' },
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when bio pt-BR is empty', () => {
      const result = Profile.create({
        ...validProps,
        bio: { 'pt-BR': '' },
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

    it('should return Left when a featured slug is invalid', () => {
      const result = Profile.create({
        ...validProps,
        featuredProjectSlugs: ['valid-slug', 'INVALID SLUG'],
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Slug.ERROR_CODE);
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
