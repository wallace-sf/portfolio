import { ProfessionalValue, Text, ValidationError } from '~/index';

import { ProfessionalValueBuilder } from '../helpers';

describe('ProfessionalValue', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid ProfessionalValue', () => {
      const result = ProfessionalValue.create(
        ProfessionalValueBuilder.build().toProps(),
      );

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(ProfessionalValue);
    });

    it('should create professional value with all fields as VOs', () => {
      const icon = 'arrow-right';
      const content = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';

      const result = ProfessionalValue.create(
        ProfessionalValueBuilder.build()
          .withIcon(icon)
          .withContent(content)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.icon.value).toBe(icon);
      expect(result.value.content.value).toBe(content);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when icon is invalid', () => {
      const result = ProfessionalValue.create(
        ProfessionalValueBuilder.build().withoutIcon().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });

    it('should return Left when content is invalid', () => {
      const result = ProfessionalValue.create(
        ProfessionalValueBuilder.build().withoutContent().toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Text.ERROR_CODE);
    });
  });
});
