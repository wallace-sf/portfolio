import { Locale } from '../../../../shared';

export interface ISkillRepository {
  findNamesByIds(ids: string[], locale: Locale): Promise<Map<string, string>>;
}
