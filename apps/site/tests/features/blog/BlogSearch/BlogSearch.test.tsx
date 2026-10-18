/**
 * @vitest-environment jsdom
 */
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogSearch } from '~features/blog/BlogSearch';
import type { SearchablePost } from '~features/blog/search/types';
import { SearchExcerpt } from '~features/blog/SearchExcerpt';

import { renderWithIntl } from '../../../helpers/renderServerComponent';

let urlQuery = '';

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  useSearchParams: () => new URLSearchParams(urlQuery),
}));

const POSTS: SearchablePost[] = [
  {
    slug: 'either',
    title: 'The Either pattern',
    description: 'Errors as values.',
    tags: ['typescript'],
  },
  {
    slug: 'validator',
    title: 'One Validator, one left',
    description: 'Chained rules.',
    tags: ['ddd'],
  },
  {
    slug: 'routes',
    title: 'Static blog routes',
    description: 'generateStaticParams.',
    tags: ['nextjs'],
  },
];

const INDEX = [
  { slug: 'either', text: 'Return a left instead of throwing.' },
  { slug: 'validator', text: 'Every rule chains on the same Validator.' },
  { slug: 'routes', text: 'Prerender every page and keep the Validator out.' },
];

const CARDS = Object.fromEntries(
  POSTS.map(({ slug, title }) => [
    slug,
    <article key={slug} data-testid={`card-${slug}`}>
      <h3>{title}</h3>
      <SearchExcerpt slug={slug} />
    </article>,
  ]),
);

const fetchMock = vi.fn();

const renderSearch = () =>
  renderWithIntl(
    <BlogSearch
      locale="en-US"
      posts={POSTS}
      cards={CARDS}
      before={<section>Featured band</section>}
      after={<section>Archive by year</section>}
    />,
  );

const input = () => screen.getByRole('searchbox', { name: 'Search posts' });
const cardSlugs = () =>
  screen.getAllByTestId(/^card-/).map((card) => card.dataset.testid?.slice(5));
const type = (value: string) =>
  fireEvent.change(input(), { target: { value } });

beforeEach(() => {
  urlQuery = '';
  window.history.replaceState(null, '', '/en-US/blog');
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => INDEX,
  });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchMock.mockReset();
});

describe('BlogSearch', () => {
  it('should render the full listing in order when there is no query', () => {
    renderSearch();

    expect(screen.getByText('Featured band')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'All posts' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Archive by year')).toBeInTheDocument();
    expect(cardSlugs()).toEqual(['either', 'validator', 'routes']);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should replace the sections with ranked results and a count when typing', () => {
    renderSearch();

    type('either');

    expect(screen.queryByText('Featured band')).not.toBeInTheDocument();
    expect(screen.queryByText('Archive by year')).not.toBeInTheDocument();
    expect(screen.getByText('1 post matches “either”')).toBeInTheDocument();
    expect(cardSlugs()).toEqual(['either']);
    expect(window.location.search).toBe('?q=either');
  });

  it('should fetch the index once on focus and find body-only matches with an excerpt', async () => {
    renderSearch();

    fireEvent.focus(input());
    fireEvent.focus(input());
    type('validator');

    await waitFor(() => expect(cardSlugs()).toEqual(['validator', 'routes']));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/en-US/blog/search-index.json');
    const routes = screen.getByTestId('card-routes');
    expect(
      within(routes).getByText('Validator', { selector: 'mark' }),
    ).toBeInTheDocument();
  });

  it('should keep card-field results when the index request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => null,
    });
    renderSearch();

    fireEvent.focus(input());
    type('validator');

    await waitFor(() => expect(console.error).toHaveBeenCalled());
    expect(cardSlugs()).toEqual(['validator']);
  });

  it('should restore the listing and drop ?q= when Escape is pressed', () => {
    renderSearch();
    type('either');

    fireEvent.keyDown(input(), { key: 'Escape' });

    expect(input()).toHaveValue('');
    expect(screen.getByText('Featured band')).toBeInTheDocument();
    expect(cardSlugs()).toEqual(['either', 'validator', 'routes']);
    expect(window.location.search).toBe('');
  });

  it('should clear the search when the clear button is pressed', () => {
    renderSearch();
    type('either');

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input()).toHaveValue('');
    expect(screen.getByText('Archive by year')).toBeInTheDocument();
  });

  it('should show a message and a link to the tags when nothing matches', () => {
    renderSearch();

    type('kubernetes');

    expect(screen.queryAllByTestId(/^card-/)).toHaveLength(0);
    expect(screen.getByText('No posts match “kubernetes”')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All tags' })).toHaveAttribute(
      'href',
      '/en-US/blog/tags',
    );
  });

  it('should start searching and load the index when the URL has ?q=', async () => {
    urlQuery = 'q=validator';
    renderSearch();

    expect(input()).toHaveValue('validator');
    await waitFor(() => expect(cardSlugs()).toEqual(['validator', 'routes']));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
