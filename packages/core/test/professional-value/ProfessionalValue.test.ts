import { ProfessionalValue, Text, ValidationError } from '../../src';
import { ProfessionalValueBuilder } from '../data';

describe('ProfessionalValue', () => {
  it('should be valid when props are valid', () => {
    const professionalValue = ProfessionalValueBuilder.build().now();

    expect(professionalValue).toBeInstanceOf(ProfessionalValue);
  });

  it('should be invalid when icon is invalid', () => {
    expect(() => ProfessionalValueBuilder.build().withoutIcon().now()).toThrow(
      new ValidationError({
        code: Text.ERROR_CODE,
        message: 'The value must be between 2 and 50 characters.',
      }),
    );
  });

  it('should be invalid when content is invalid', () => {
    expect(() =>
      ProfessionalValueBuilder.build().withoutContent().now(),
    ).toThrow(
      new ValidationError({
        code: Text.ERROR_CODE,
        message: 'The value must be between 1 and 125000 characters.',
      }),
    );
  });

  it('should create new professional value from valid props', () => {
    const icon = 'arrow-right';
    const content = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';

    const professionalValue = ProfessionalValueBuilder.build()
      .withIcon(icon)
      .withContent(content)
      .now();

    expect(professionalValue).toBeInstanceOf(ProfessionalValue);
    expect(professionalValue.icon.value).toBe(icon);
    expect(professionalValue.content.value).toBe(content);
  });

  it('should create multiple professional values from valid props', () => {
    const professionalValues = ProfessionalValueBuilder.list(2);

    expect(professionalValues).toHaveLength(2);
  });
});
