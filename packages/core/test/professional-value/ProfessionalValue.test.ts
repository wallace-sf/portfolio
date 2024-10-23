import { ValidationError } from '@repo/utils';

import { ProfessionalValue, Text } from '../../src';
import { ProfessionalValueBuilder } from '../data';

describe('ProfessionalValue', () => {
  it('should be valid when props are valid', () => {
    const professionalValue = ProfessionalValueBuilder.build().now();

    expect(professionalValue).toBeInstanceOf(ProfessionalValue);
  });

  it('should be invalid when icon is invalid', () => {
    expect(() => ProfessionalValueBuilder.build().withoutIcon().now()).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 2 e 50 caracteres.',
      ),
    );
  });

  it('should be invalid when content is invalid', () => {
    expect(() =>
      ProfessionalValueBuilder.build().withoutContent().now(),
    ).toThrow(
      new ValidationError(
        Text.ERROR_CODE,
        'O texto deve ter entre 1 e 125000 caracteres.',
      ),
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
