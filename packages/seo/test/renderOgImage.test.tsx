import { render, screen } from '@testing-library/react';

import { OG_IMAGE_SIZE, renderOgImage } from '~/renderOgImage';

const baseParams = {
  title: 'The Either pattern in TypeScript',
  locale: 'pt-BR' as const,
  siteHost: 'wallace-ferreira.dev',
};

describe('renderOgImage', () => {
  it('should expose the shared 1200x630 image size', () => {
    expect(OG_IMAGE_SIZE).toEqual({ width: 1200, height: 630 });
  });

  it('should render the title, locale badge and site host when given the minimal params', () => {
    render(renderOgImage(baseParams));

    expect(screen.getByText(baseParams.title)).toBeInTheDocument();
    expect(screen.getByText('pt-BR')).toBeInTheDocument();
    expect(screen.getByText('wallace-ferreira.dev')).toBeInTheDocument();
  });

  it('should render the subtitle, page label and job title when provided', () => {
    render(
      renderOgImage({
        ...baseParams,
        subtitle: 'Modeling failure without exceptions',
        page: 'BLOG',
        jobTitle: 'Front-end Software Engineer',
      }),
    );

    expect(
      screen.getByText('Modeling failure without exceptions'),
    ).toBeInTheDocument();
    expect(screen.getByText('BLOG')).toBeInTheDocument();
    expect(
      screen.getByText('Front-end Software Engineer'),
    ).toBeInTheDocument();
  });

  it('should omit the subtitle, page label and job title when not provided', () => {
    render(renderOgImage(baseParams));

    expect(screen.queryByText('BLOG')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Front-end Software Engineer'),
    ).not.toBeInTheDocument();
  });
});
