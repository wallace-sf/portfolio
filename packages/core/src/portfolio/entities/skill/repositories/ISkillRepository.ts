import { Id } from '../../../../shared';
import { Skill } from '../model/Skill';

export interface ISkillRepository {
  findAll(): Promise<Skill[]>;
  findById(id: Id): Promise<Skill | null>;
  save(skill: Skill): Promise<void>;
  delete(id: Id): Promise<void>;
}
