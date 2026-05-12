import { Prisma } from '@prisma/client';
import {
  IProfessionalValueProps,
  ProfessionalValue,
} from '@repo/core/portfolio';
import { ILocalizedTextInput } from '@repo/core/shared';

import { InfrastructureError } from '../../errors/InfrastructureError';

type PrismaProfessionalValue = Prisma.ProfessionalValueGetPayload<
  Record<string, never>
>;

type ProfessionalValueScalarData = Prisma.ProfessionalValueUncheckedCreateInput;

export class ProfessionalValueMapper {
  static toDomain(raw: PrismaProfessionalValue): ProfessionalValue {
    const asLocalized = (v: unknown) => v as ILocalizedTextInput;

    const props: IProfessionalValueProps = {
      id: raw.id,
      icon: raw.icon,
      content: asLocalized(raw.content),
      created_at: raw.createdAt.toISOString(),
      updated_at: raw.updatedAt.toISOString(),
    };

    const result = ProfessionalValue.create(props);
    if (result.isLeft()) {
      throw new InfrastructureError(
        `Failed to map ProfessionalValue ${raw.id} to domain: ${result.value.message}`,
        result.value,
      );
    }

    return result.value;
  }

  static toPrisma(
    domain: ProfessionalValue,
    order: number,
  ): ProfessionalValueScalarData {
    return {
      id: domain.id.value,
      icon: domain.icon.value,
      content: domain.content.value,
      order,
      createdAt: new Date(domain.created_at.value),
      updatedAt: new Date(domain.updated_at.value),
    };
  }
}
