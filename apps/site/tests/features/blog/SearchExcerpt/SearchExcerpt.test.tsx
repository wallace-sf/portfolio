/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  type ISearchState,
  SearchContext,
} from '~features/blog/BlogSearch/context';
import { SearchExcerpt } from '~features/blog/SearchExcerpt';

const BODY = 'Every rule chains on the same Validator and returns one left.';

const renderWith = (state: ISearchState) =>
  render(
    <SearchContext.Provider value={state}>
      <SearchExcerpt slug="one-validator" />
    </SearchContext.Provider>,
  );

describe('SearchExcerpt', () => {
  it('should render the passage with the terms marked when the body matches', () => {
    const { container } = renderWith({
      terms: ['validator'],
      bodies: { 'one-validator': BODY },
    });

    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('Validator');
    expect(container.querySelector('p')).toHaveTextContent(BODY);
  });

  it('should render nothing when there is no query', () => {
    const { container } = renderWith({
      terms: [],
      bodies: { 'one-validator': BODY },
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing when the index has not loaded', () => {
    const { container } = renderWith({ terms: ['validator'], bodies: {} });

    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing when the body lacks every term', () => {
    renderWith({
      terms: ['either'],
      bodies: { 'one-validator': BODY },
    });

    expect(screen.queryByText(/Validator/)).not.toBeInTheDocument();
  });
});
