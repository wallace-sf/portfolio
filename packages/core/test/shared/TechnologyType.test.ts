import { TechnologyType, TechnologyTypeEnum } from '../../src';

describe('TechnologyType', () => {
  describe('when is new', () => {
    it('should be valid when param is valid', () => {
      const technology = TechnologyType.new(TechnologyTypeEnum.DATABASE);

      expect(technology.value).toBe(TechnologyTypeEnum.DATABASE);
      expect(technology.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => TechnologyType.new('#' as TechnologyTypeEnum)).toThrow(
        new Error(TechnologyType.ERROR_INVALID_TECHNOLOGY_TYPE),
      );
    });
  });

  describe('when is compared', () => {
    it('should be valid when two technologies are equal', () => {
      const technology1 = TechnologyType.new(TechnologyTypeEnum.DATABASE);
      const technology2 = TechnologyType.new(technology1.value);

      expect(technology1.equals(technology2)).toBe(true);
      expect(technology1.diff(technology2)).toBe(false);
    });

    describe('assert static method isValid', () => {
      it('should be valid when param is valid', () => {
        const technology = TechnologyType.new(TechnologyTypeEnum.DATABASE);

        expect(TechnologyType.isValid(technology.value)).toBe(true);
      });

      it('should be invalid when param is invalid', () => {
        expect(TechnologyType.isValid('#' as TechnologyTypeEnum)).toBe(false);
      });
    });
  });
});
