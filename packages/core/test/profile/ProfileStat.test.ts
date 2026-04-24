import { LocalizedText, Text, ValidationError } from '~/index';
import { ProfileStat } from '~/portfolio/entities/profile/model/ProfileStat';

const validProps = {
  label: { 'en-US': 'Years of experience', 'pt-BR': 'Anos de experiência' },
  value: '5+',
  icon: 'briefcase',
};

describe('ProfileStat', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid ProfileStat', () => {
      const result = ProfileStat.create(validProps);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(ProfileStat);
    });

    it('should expose label, value and icon', () => {
      const result = ProfileStat.create(validProps);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.label).toBeInstanceOf(LocalizedText);
      expect(result.value.label.get('pt-BR')).toBe('Anos de experiência');
      expect(result.value.value).toBe('5+');
      expect(result.value.icon).toBeInstanceOf(Text);
      expect(result.value.icon.value).toBe('briefcase');
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when label en-US is empty', () => {
      const result = ProfileStat.create({
        ...validProps,
        label: { 'en-US': '' },
      });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when icon is empty', () => {
      const result = ProfileStat.create({ ...validProps, icon: '' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when value is empty', () => {
      const result = ProfileStat.create({ ...validProps, value: '' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });
  });
});
