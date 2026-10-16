/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { MarkdownHeading } from '@repo/ui/View';

import { PostToc } from '~features/blog/PostToc';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

const heading = (id: string): MarkdownHeading => ({ id, text: id, depth: 2 });
const THREE = ['one', 'two', 'three'].map(heading);

describe('PostToc', () => {
  it('should render nothing when the post has fewer than three headings', async () => {
    const { container } = await renderServerComponent(
      PostToc({
        headings: THREE.slice(0, 2),
        locale: 'en-US',
        variant: 'inline',
      }),
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render a collapsed details block labelled in the locale when inline', async () => {
    const { container } = await renderServerComponent(
      PostToc({ headings: THREE, locale: 'pt-BR', variant: 'inline' }),
    );

    const details = container.querySelector('details');
    expect(details).not.toHaveAttribute('open');
    expect(details?.querySelector('summary')).toHaveTextContent('Nesta página');
    expect(
      screen.getByRole('navigation', { name: 'Nesta página' }),
    ).toBeInTheDocument();
  });

  it('should render a labelled navigation without a details block when it is the rail', async () => {
    const { container } = await renderServerComponent(
      PostToc({ headings: THREE, locale: 'en-US', variant: 'rail' }),
    );

    expect(container.querySelector('details')).not.toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'On this page' }),
    ).toBeInTheDocument();
  });
});
