/** The `?q=` search param that holds the listing's query. */
export const QUERY_PARAM = 'q';

/**
 * Writes `query` to `?q=` (removed when empty) without a navigation:
 * `router.replace` would request the RSC payload on every keystroke, while
 * `replaceState` is picked up by `useSearchParams` with no server round trip.
 */
export function writeQueryParam(query: string): void {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set(QUERY_PARAM, query);
  else url.searchParams.delete(QUERY_PARAM);
  window.history.replaceState(null, '', url);
}
