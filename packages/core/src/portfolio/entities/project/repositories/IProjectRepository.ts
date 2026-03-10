import { Id, Slug } from '../../../../shared';
import { Project } from '../model/Project';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findPublished(): Promise<Project[]>;
  findFeatured(): Promise<Project[]>;
  findById(id: Id): Promise<Project | null>;
  findBySlug(slug: Slug): Promise<Project | null>;
  findRelated(id: Id, limit?: number): Promise<Project[]>;
  save(project: Project): Promise<void>;
  delete(id: Id): Promise<void>;
}
