import { Project } from '~/portfolio/entities/project/model/Project';
import { Slug, Id } from '~/shared';
import { IRepository } from '~/shared/base/IRepository';

export interface IProjectRepository extends IRepository<Project> {
  findPublished(): Promise<Project[]>;
  findFeatured(): Promise<Project[]>;
  findBySlug(slug: Slug): Promise<Project | null>;
  findRelated(id: Id, limit?: number): Promise<Project[]>;
}
