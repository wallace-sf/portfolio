import { Entity, IEntityProps } from '~/shared/base/Entity';

/**
 * Marks entities that serve as transactional consistency boundaries
 * and have their own repositories for persistence.
 * Distinct aggregates reference each other by Id, not by object.
 */
export abstract class AggregateRoot<
  TEntity,
  TProps extends IEntityProps,
> extends Entity<TEntity, TProps> {}
