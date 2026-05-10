import {
  IProfessionalValueRepository,
  ProfessionalValue,
} from '@repo/core/portfolio';
import { DomainError, Either, left, right } from '@repo/core/shared';

import { UseCase } from '../../shared/UseCase';
import { ProfessionalValueDTO } from '../dtos/ProfessionalValueDTO';

export type GetProfessionalValuesInput = Record<string, never>;

export class GetProfessionalValues extends UseCase<
  GetProfessionalValuesInput,
  ProfessionalValueDTO[]
> {
  constructor(
    private readonly professionalValueRepository: IProfessionalValueRepository,
  ) {
    super();
  }

  async execute(): Promise<Either<DomainError, ProfessionalValueDTO[]>> {
    try {
      const values = await this.professionalValueRepository.findAll();
      return right(values.map(this.toDTO));
    } catch {
      return left(
        new DomainError('FETCH_FAILED', {
          message: 'Failed to fetch professional values',
        }),
      );
    }
  }

  private toDTO(value: ProfessionalValue): ProfessionalValueDTO {
    return {
      id: value.id.value,
      icon: value.icon.value,
      content: value.content.value,
    };
  }
}
