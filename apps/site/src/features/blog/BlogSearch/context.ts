import { createContext, useContext } from 'react';

import type { SearchBodies } from '~features/blog/search/types';

export interface ISearchState {
  /** Folded query terms; empty when nothing is being searched. */
  terms: readonly string[];
  /** Plain-text bodies by slug; empty until the index loads. */
  bodies: SearchBodies;
}

const IDLE: ISearchState = { terms: [], bodies: {} };

/**
 * What the island shares with the `SearchExcerpt`s inside the server-rendered
 * cards: those cards are props, so context is the only way in.
 */
export const SearchContext = createContext<ISearchState>(IDLE);

export const useSearchState = (): ISearchState => useContext(SearchContext);
