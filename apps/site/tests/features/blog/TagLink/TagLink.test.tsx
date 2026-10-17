/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TagLink } from '~features/blog/TagLink';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

describe('TagLink', () => {
  it('should link the tag to its locale-prefixed tag page when rendered', async () => {
    await renderServerComponent(<TagLink tag="clean-architecture" />, {
      locale: 'pt-BR',
    });

    expect(
      screen.getByRole('link', { name: 'clean-architecture' }),
    ).toHaveAttribute('href', '/pt-BR/blog/tags/clean-architecture');
  });

  it('should show the post count after the tag when a count is given', async () => {
    await renderServerComponent(<TagLink tag="ddd" count={3} />, {
      locale: 'en-US',
    });

    expect(screen.getByRole('link', { name: 'ddd · 3' })).toHaveAttribute(
      'href',
      '/en-US/blog/tags/ddd',
    );
  });
});
