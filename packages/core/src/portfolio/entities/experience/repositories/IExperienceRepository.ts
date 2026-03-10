import { Id } from '../../../../shared';
import { Experience } from '../model/Experience';

export interface IExperienceRepository {
  findAll(): Promise<Experience[]>;
  findById(id: Id): Promise<Experience | null>;
  save(experience: Experience): Promise<void>;
  delete(id: Id): Promise<void>;
}
