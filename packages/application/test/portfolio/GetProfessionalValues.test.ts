import { describe, expect, it, vi } from 'vitest';

import {
  IProfessionalValueRepository,
  IProfessionalValueProps,
  ProfessionalValue,
} from '@repo/core/portfolio';
import { DomainError } from '@repo/core/shared';

import { ProfessionalValueDTO } from '~/portfolio/dtos/ProfessionalValueDTO';
import { GetProfessionalValues } from '~/portfolio/use-cases/GetProfessionalValues';

const BASE_PROPS: IProfessionalValueProps = {
  icon: 'material-symbols:diamond',
  content: 'Delivering high quality products',
};

function makeValue(
  overrides: Partial<IProfessionalValueProps> = {},
): ProfessionalValue {
  const result = ProfessionalValue.create({ ...BASE_PROPS, ...overrides });
  if (result.isLeft())
    throw new Error(`makeValue failed: ${result.value.message}`);
  return result.value;
}

function makeRepository(
  overrides: Partial<IProfessionalValueRepository> = {},
): IProfessionalValueRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  };
}

describe('GetProfessionalValues', () => {
  describe('execute()', () => {
    it('should return Right with empty array when repository returns no values', async () => {
      const repo = makeRepository({ findAll: vi.fn().mockResolvedValue([]) });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual([]);
    });

    it('should return Right with mapped DTOs when repository returns values', async () => {
      const value = makeValue();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([value]),
      });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);
      expect(result.value as ProfessionalValueDTO[]).toHaveLength(1);
    });

    it('should map all DTO fields correctly', async () => {
      const value = makeValue();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([value]),
      });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);
      const dto = (result.value as ProfessionalValueDTO[])[0]!;

      expect(dto.id).toBe(value.id.value);
      expect(dto.icon).toBe('material-symbols:diamond');
      expect(dto.content).toBe('Delivering high quality products');
    });

    it('should preserve repository order', async () => {
      const first = makeValue({ icon: 'material-symbols:one', content: 'First value' });
      const second = makeValue({ icon: 'material-symbols:two', content: 'Second value' });
      const third = makeValue({ icon: 'material-symbols:three', content: 'Third value' });

      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([first, second, third]),
      });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);
      const dtos = result.value as ProfessionalValueDTO[];
      expect(dtos[0]!.content).toBe('First value');
      expect(dtos[1]!.content).toBe('Second value');
      expect(dtos[2]!.content).toBe('Third value');
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findAll: vi.fn().mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute();

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should call findAll() on the repository', async () => {
      const findAll = vi.fn().mockResolvedValue([]);
      const repo = makeRepository({ findAll });
      const useCase = new GetProfessionalValues(repo);

      await useCase.execute();

      expect(findAll).toHaveBeenCalledOnce();
    });
  });
});
