import { ShortText } from '../../src';

describe('ShortText', () => {
  describe('when is new', () => {
    const text = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';
    const shortText = ShortText.new(text);

    it('should be valid when text is valid', () => {
      expect(shortText.value).toBe(text);
      expect(shortText.isNew).toBe(false);
    });

    it('should be invalid when text is invalid', () => {
      expect(() => ShortText.new('')).toThrow(new Error(ShortText.ERROR_CODE));
      expect(() => ShortText.new()).toThrow(new Error(ShortText.ERROR_CODE));
      expect(() =>
        ShortText.new(
          `Lorem ipsum odor amet, consectetuer adipiscing elit. Justo cras risus rutrum; eget dis leo. Enim tristique mauris venenatis quisque congue gravida tellus cras. Massa risus proin duis nunc vitae adipiscing malesuada senectus. Lorem vivamus molestie morbi placerat nibh accumsan hendrerit non dolor. Sed dignissim sociosqu natoque eu litora tempus interdum eleifend. Nulla consectetur duis ligula ante risus ac mattis. Litora tincidunt curae tempor viverra aenean venenatis eu. Non cursus nisl viverra sit imperdiet. Aptent ultrices gravida, curae a semper justo volutpat dui gravida. Conubia sagittis congue iaculis dapibus lacinia montes magnis quis. Maximus imperdiet montes gravida sollicitudin dolor malesuada purus. Aenean euismod vehicula parturient sodales vestibulum cras platea. Penatibus sollicitudin ante; nullam torquent lobortis iaculis morbi. Dolor efficitur natoque magna; porta cras euismod.`,
        ),
      ).toThrow(new Error(ShortText.ERROR_CODE));
    });
  });

  describe('when is compared', () => {
    it('should be valid when two short texts are equal', () => {
      const text = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';

      const shortText1 = ShortText.new(text);
      const shortText2 = ShortText.new(shortText1.value);

      expect(shortText1.equals(shortText2)).toBe(true);
      expect(shortText1.diff(shortText2)).toBe(false);
    });
  });

  describe('asserts static method isValid', () => {
    it('should be valid when param is a text', () => {
      const text = 'Lorem ipsum odor amet, consectetuer adipiscing elit.';

      expect(ShortText.isValid(text)).toBe(true);
    });

    it('should be invalid when param is empty', () => {
      expect(ShortText.isValid('')).toBe(false);
      expect(ShortText.isValid()).toBe(false);
    });
  });
});
