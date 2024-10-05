import { ValidationError } from '@repo/utils';

import { EmploymentType } from '../../src';

describe('EmploymentType', () => {
  describe('when is new', () => {
    it('should be valid when param is valid', () => {
      const apprentice = EmploymentType.new('APPRENTICE');
      const freelance = EmploymentType.new('FREELANCE');
      const fullTime = EmploymentType.new('FULL_TIME');
      const internship = EmploymentType.new('INTERNSHIP');
      const partTime = EmploymentType.new('PART_TIME');
      const selfEmployed = EmploymentType.new('SELF_EMPLOYED');
      const temporary = EmploymentType.new('TEMPORARY');
      const trainee = EmploymentType.new('TRAINEE');

      expect(apprentice.value).toBe('APPRENTICE');
      expect(freelance.value).toBe('FREELANCE');
      expect(fullTime.value).toBe('FULL_TIME');
      expect(internship.value).toBe('INTERNSHIP');
      expect(partTime.value).toBe('PART_TIME');
      expect(selfEmployed.value).toBe('SELF_EMPLOYED');
      expect(temporary.value).toBe('TEMPORARY');
      expect(trainee.value).toBe('TRAINEE');
      expect(apprentice.isNew).toBe(false);
      expect(freelance.isNew).toBe(false);
      expect(fullTime.isNew).toBe(false);
      expect(internship.isNew).toBe(false);
      expect(partTime.isNew).toBe(false);
      expect(selfEmployed.isNew).toBe(false);
      expect(temporary.isNew).toBe(false);
      expect(trainee.isNew).toBe(false);
    });

    it('should be invalid when param is invalid', () => {
      expect(() => EmploymentType.new('' as 'APPRENTICE')).toThrow(
        new ValidationError(
          EmploymentType.ERROR_CODE,
          'O valor deve ser um tipo de emprego válido.',
        ),
      );
      expect(() => EmploymentType.new('#' as 'FREELANCE')).toThrow(
        new ValidationError(
          EmploymentType.ERROR_CODE,
          'O valor deve ser um tipo de emprego válido.',
        ),
      );
    });
  });

  describe('when is compared', () => {
    it('should be valid when two employment types are equal', () => {
      const param = 'APPRENTICE';

      const employmentType1 = EmploymentType.new(param);
      const employmentType2 = EmploymentType.new(employmentType1.value);

      expect(employmentType1.equals(employmentType2)).toBe(true);
      expect(employmentType1.diff(employmentType2)).toBe(false);
    });
  });
});
