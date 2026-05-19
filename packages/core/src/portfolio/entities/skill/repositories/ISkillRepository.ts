import { Locale } from '../../../../shared';

export type SkillInfo = { name: string; icon: string };

export interface ISkillRepository {
  findNamesByIds(
    ids: string[],
    locale: Locale,
  ): Promise<Map<string, SkillInfo>>;
}
