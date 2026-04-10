import { Id } from '~/shared/vo/Id';

/**
 * Generic base repository interface for entity persistence operations.
 *
 * @template T - The domain entity type managed by this repository
 */
export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: Id): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: Id): Promise<void>;
}
