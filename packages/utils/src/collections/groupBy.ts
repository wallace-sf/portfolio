/**
 * Groups items by key, as `[key, items][]`. Keys keep their first-seen order
 * (a `Set` preserves insertion order) and items keep their input order inside
 * each group, so a sorted input yields sorted groups.
 *
 * Returns entries, not an object: object keys that look like integers iterate
 * in ascending order, which would silently reorder groups such as years.
 * Replace with the native `Map.groupBy` once `lib` reaches ES2024 (#1147).
 */
export const groupBy = <T, K>(
  items: readonly T[],
  keyOf: (item: T) => K,
): [K, T[]][] =>
  [...new Set(items.map(keyOf))].map((key) => [
    key,
    items.filter((item) => keyOf(item) === key),
  ]);
