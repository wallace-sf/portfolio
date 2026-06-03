/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

import HomeLoading from '~/app/[locale]/loading';
import ProjectsLoading from '~/app/[locale]/projects/loading';

describe('Loading skeletons', () => {
  it('should render HomeLoading without crashing', async () => {
    const { container } = render(await HomeLoading());
    expect(container.firstChild).toBeTruthy();
  });

  it('should render ProjectsLoading without crashing', async () => {
    const { container } = render(await ProjectsLoading());
    expect(container.firstChild).toBeTruthy();
  });
});
