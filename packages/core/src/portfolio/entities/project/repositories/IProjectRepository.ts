import { Slug } from '../../../../shared';
import { Id } from '../../../../shared';
import { IRepository } from '../../../../shared/base/IRepository';
import { Project } from '../model/Project';

export interface IProjectRepository extends IRepository<Project> {
  findPublished(): Promise<Project[]>;
  findFeatured(): Promise<Project[]>;
  findBySlug(slug: Slug): Promise<Project | null>;
  findRelated(id: Id, limit?: number): Promise<Project[]>;
}
