'use client';

import { useEffect, useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import { QUERY_PARAM } from './queryParam';

export interface IQuerySyncProps {
  onQuery: (query: string) => void;
}

/**
 * Reports `?q=` to the island **once, on mount**: a shared search link, or
 * coming back to the listing from a result. After that the input owns the
 * query; echoing every URL update back would let a late update from an
 * earlier keystroke overwrite newer typing. It's the only component that reads
 * search params, inside its own `<Suspense fallback={null}>`, so the listing
 * around it stays prerendered. It renders nothing.
 */
export function QuerySync({ onQuery }: IQuerySyncProps) {
  const query = useSearchParams().get(QUERY_PARAM) ?? '';
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    onQuery(query);
  }, [query, onQuery]);

  return null;
}
