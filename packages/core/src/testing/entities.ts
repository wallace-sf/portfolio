import * as core from '../index';
import { Entity } from '../shared';

/**
 * Names of the concrete entities `@repo/core` exports: classes extending
 * `Entity` that declare their own static `create` (which skips the abstract
 * bases). Derived from the exports, so a new entity is picked up on its own.
 */
export const ENTITY_NAMES: readonly string[] = Object.entries(core)
  .filter(
    ([, value]) =>
      typeof value === 'function' &&
      value.prototype instanceof Entity &&
      Object.hasOwn(value, 'create'),
  )
  .map(([name]) => name)
  .sort();
