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
  content: {
    'en-US': 'Delivering high quality products',
    'pt-BR': 'Entrega de produtos de alta qualidade',
  },
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

      const result = await useCase.execute({ locale: 'en-US' });

      expect(result.isRight()).toBe(true);
      expect(result.value).toEqual([]);
    });

    it('should return Right with mapped DTOs when repository returns values', async () => {
      const value = makeValue();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([value]),
      });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute({ locale: 'en-US' });

      expect(result.isRight()).toBe(true);
      expect(result.value as ProfessionalValueDTO[]).toHaveLength(1);
    });

    it('should map content using the requested locale', async () => {
      const value = makeValue();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([value]),
      });
      const useCase = new GetProfessionalValues(repo);

      const enResult = await useCase.execute({ locale: 'en-US' });
      const ptResult = await useCase.execute({ locale: 'pt-BR' });

      const enDto = (enResult.value as ProfessionalValueDTO[])[0]!;
      const ptDto = (ptResult.value as ProfessionalValueDTO[])[0]!;

      expect(enDto.content).toBe('Delivering high quality products');
      expect(ptDto.content).toBe('Entrega de produtos de alta qualidade');
    });

    it('should fall back to en-US when locale translation is missing', async () => {
      const value = makeValue({
        content: { 'en-US': 'English only content' },
      });
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([value]),
      });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      const dto = (result.value as ProfessionalValueDTO[])[0]!;
      expect(dto.content).toBe('English only content');
    });

    it('should map icon and id fields correctly', async () => {
      const value = makeValue();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([value]),
      });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute({ locale: 'en-US' });
      const dto = (result.value as ProfessionalValueDTO[])[0]!;

      expect(dto.id).toBe(value.id.value);
      expect(dto.icon).toBe('material-symbols:diamond');
    });

    it('should return Left with DomainError when repository throws', async () => {
      const repo = makeRepository({
        findAll: vi.fn().mockRejectedValue(new Error('DB connection failed')),
      });
      const useCase = new GetProfessionalValues(repo);

      const result = await useCase.execute({ locale: 'en-US' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(DomainError);
      expect((result.value as DomainError).code).toBe('FETCH_FAILED');
    });

    it('should call findAll() on the repository', async () => {
      const findAll = vi.fn().mockResolvedValue([]);
      const repo = makeRepository({ findAll });
      const useCase = new GetProfessionalValues(repo);

      await useCase.execute({ locale: 'en-US' });

      expect(findAll).toHaveBeenCalledOnce();
    });
  });
});
