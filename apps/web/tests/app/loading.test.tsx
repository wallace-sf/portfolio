import { render } from '@testing-library/react';

import HomeLoading from '~/app/[locale]/loading';
import ProjectsLoading from '~/app/[locale]/projects/loading';
import AboutLoading from '~/app/[locale]/about/loading';

describe('Loading skeletons', () => {
  it('should render HomeLoading without crashing', () => {
    const { container } = render(<HomeLoading />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render ProjectsLoading without crashing', () => {
    const { container } = render(<ProjectsLoading />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render AboutLoading without crashing', () => {
    const { container } = render(<AboutLoading />);
    expect(container.firstChild).toBeTruthy();
  });
});
