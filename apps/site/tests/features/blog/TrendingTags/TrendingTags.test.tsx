/**
 * @vitest-environment jsdom
 */
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TRENDING_TAGS_LIMIT, TrendingTags } from '~features/blog/TrendingTags';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

const tags = Array.from({ length: 10 }, (_, index) => ({
  tag: `tag-${index + 1}`,
  count: 10 - index,
}));

describe('TrendingTags', () => {
  it('should show the most used tags up to the limit, in order, with their counts', async () => {
    await renderServerComponent(TrendingTags({ tags, locale: 'en-US' }));

    const section = screen.getByRole('region', { name: 'Trending tags' });
    const tagLinks = within(within(section).getByRole('list'))
      .getAllByRole('link')
      .map((link) => link.textContent);

    expect(tagLinks).toHaveLength(TRENDING_TAGS_LIMIT);
    expect(tagLinks.slice(0, 2)).toEqual(['tag-1 · 10', 'tag-2 · 9']);
    expect(tagLinks).not.toContain('tag-9 · 2');
  });

  it('should link to the tag index after the tags when rendered', async () => {
    await renderServerComponent(TrendingTags({ tags, locale: 'pt-BR' }), {
      locale: 'pt-BR',
    });

    expect(screen.getByRole('link', { name: 'Todas as tags' })).toHaveAttribute(
      'href',
      '/pt-BR/blog/tags',
    );
  });

  it('should render nothing when there are no tags', async () => {
    const { container } = await renderServerComponent(
      TrendingTags({ tags: [], locale: 'en-US' }),
    );

    expect(container).toBeEmptyDOMElement();
  });
});
