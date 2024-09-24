import { ValidationError } from '@repo/utils';

import { Text } from '../../src';

describe('Text', () => {
  describe('when is new', () => {
    it('should be valid when text is valid', () => {
      const value = 'Lorem ipsum odor amet.';
      const text = Text.new(value);

      expect(text.value).toBe(value);
      expect(text.isNew).toBe(false);
    });

    it('should be valid when text is valid and using config', () => {
      const value = 'Lorem ipsum odor amet.';
      const text = Text.new(value, { min: 3, max: 22 });

      expect(text.value).toBe(value);
      expect(text.isNew).toBe(false);
    });

    it('should be invalid when text is invalid', () => {
      expect(() => Text.new('')).toThrow(
        new ValidationError(
          Text.ERROR_CODE,
          'O texto deve ter entre 3 e 50 caracteres.',
        ),
      );
      expect(() => Text.new()).toThrow(
        new ValidationError(
          Text.ERROR_CODE,
          'O texto deve ter entre 3 e 50 caracteres.',
        ),
      );
      expect(() =>
        Text.new(
          'Lorem ipsum odor amet, consectetuer adipiscing elit. Justo cras risus rutrum; eget dis leo. Enim tristique mauris venenatis quisque congue gravida tellus cras. Massa risus proin duis nunc vitae adipiscing malesuada senectus. Lorem vivamus molestie morbi placerat nibh accumsan hendrerit non dolor. Sed dignissim sociosqu natoque eu litora tempus interdum eleifend. Nulla consectetur duis ligula ante risus ac mattis. Litora tincidunt curae tempor viverra aenean venenatis eu. Non cursus nisl viverra sit imperdiet. Aptent ultrices gravida, curae a semper justo volutpat dui gravida. Conubia sagittis congue iaculis dapibus lacinia montes magnis quis. Maximus imperdiet montes gravida sollicitudin dolor malesuada purus. Aenean euismod vehicula parturient sodales vestibulum cras platea. Penatibus sollicitudin ante; nullam torquent lobortis iaculis morbi. Dolor efficitur natoque magna; porta cras euismod.',
        ),
      ).toThrow(
        new ValidationError(
          Text.ERROR_CODE,
          'O texto deve ter entre 3 e 50 caracteres.',
        ),
      );

      expect(() =>
        Text.new(
          'Lorem ipsum odor amet, consectetuer adipiscing elit. Justo cras risus rutrum; eget dis leo. Enim tristique mauris venenatis quisque congue gravida tellus cras. Massa risus proin duis nunc vitae adipiscing malesuada senectus. Lorem vivamus molestie morbi placerat nibh accumsan hendrerit non dolor. Sed dignissim sociosqu natoque eu litora tempus interdum eleifend. Nulla consectetur duis ligula ante risus ac mattis. Litora tincidunt curae tempor viverra aenean venenatis eu. Non cursus nisl viverra sit imperdiet. Aptent ultrices gravida, curae a semper justo volutpat dui gravida. Conubia sagittis congue iaculis dapibus lacinia montes magnis quis. Maximus imperdiet montes gravida sollicitudin dolor malesuada purus. Aenean euismod vehicula parturient sodales vestibulum cras platea. Penatibus sollicitudin ante; nullam torquent lobortis iaculis morbi. Dolor efficitur natoque magna; porta cras euismod.',
          {
            min: 3,
            max: 20,
          },
        ),
      ).toThrow(
        new ValidationError(
          Text.ERROR_CODE,
          'O texto deve ter entre 3 e 20 caracteres.',
        ),
      );
    });
  });

  describe('when is compared', () => {
    it('should be valid when two short texts are equal', () => {
      const value = 'Lorem ipsum odor amet.';

      const text1 = Text.new(value);
      const text2 = Text.new(text1.value);

      expect(text1.equals(text2)).toBe(true);
      expect(text1.diff(text2)).toBe(false);
    });
  });
});
