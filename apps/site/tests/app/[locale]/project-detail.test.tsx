/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock('@repo/core/shared', () => ({
  DEFAULT_LOCALE: 'en-US',
  LOCALES: ['en-US', 'pt-BR', 'es'],
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('~features/projects/ProjectDetail', () => ({
  ProjectDetail: ({ title, caption }: { title: string; caption: string }) => (
    <div data-testid="project-detail">
      <h1>{title}</h1>
      <p>{caption}</p>
    </div>
  ),
}));

const mockExecute = vi.fn();
const mockListExecute = vi.fn();

vi.mock('@repo/application/portfolio', () => ({
  GetProjectBySlug: vi
    .fn()
    .mockImplementation(() => ({ execute: mockExecute })),
  GetPublishedProjects: vi
    .fn()
    .mockImplementation(() => ({ execute: mockListExecute })),
}));

vi.mock('~/lib/server/container', () => ({
  getServerContainer: vi.fn().mockReturnValue({
    projectRepository: {},
    skillRepository: {},
  }),
}));

const PROJECT = {
  id: '1',
  slug: 'my-project',
  title: 'My Project',
  caption: 'A great project',
  coverImage: { url: 'https://example.com/img.jpg', alt: 'Cover' },
  thumbnailImage: {
    url: 'https://example.com/thumbnail.webp',
    alt: 'Thumbnail',
  },
  skills: [{ name: 'React', icon: '' }],
  content: '# Hello',
  publishedAt: '2024-01-01',
  period: { startAt: '2024-01-01' },
  relatedProjects: [],
};

const right = (value: unknown) => ({
  isRight: () => true,
  isLeft: () => false,
  value,
});
const left = () => ({ isRight: () => false, isLeft: () => true });

beforeEach(() => {
  vi.clearAllMocks();
  mockListExecute.mockResolvedValue(right([]));
});

describe('ProjectDetailPage', () => {
  it('should render project detail when use case returns data', async () => {
    mockExecute.mockResolvedValue(right(PROJECT));

    const { default: Page } =
      await import('~/app/[locale]/projects/[slug]/page');
    render(
      await Page({
        params: Promise.resolve({ locale: 'en-US', slug: 'my-project' }),
      }),
    );

    expect(screen.getByTestId('project-detail')).toBeInTheDocument();
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('should call notFound when use case returns left', async () => {
    mockExecute.mockResolvedValue(left());

    const { notFound } = await import('next/navigation');
    const { default: Page } =
      await import('~/app/[locale]/projects/[slug]/page');
    await expect(
      Page({ params: Promise.resolve({ locale: 'en-US', slug: 'missing' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});

describe('ProjectDetailPage generateMetadata', () => {
  async function metadataFor(locale = 'en-US') {
    mockExecute.mockResolvedValue(right(PROJECT));
    const { generateMetadata } =
      await import('~/app/[locale]/projects/[slug]/page');
    return generateMetadata({
      params: Promise.resolve({ locale, slug: 'my-project' }),
    });
  }

  it('should share a generated 1200x630 card instead of the cover when rendering a project', async () => {
    const metadata = await metadataFor();
    const images = metadata.openGraph?.images as Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;

    expect(images).toHaveLength(1);
    expect(images[0]).toMatchObject({
      width: 1200,
      height: 630,
      alt: 'My Project',
    });
    expect(images[0]?.url).not.toContain(PROJECT.coverImage.url);
  });

  it('should render the card with the project title, caption and locale when generated', async () => {
    const metadata = await metadataFor('pt-BR');
    const [image] = metadata.openGraph?.images as Array<{ url: string }>;
    const url = new URL(image!.url);

    expect(url.pathname).toBe('/og');
    expect(url.searchParams.get('title')).toBe('My Project');
    expect(url.searchParams.get('subtitle')).toBe('A great project');
    expect(url.searchParams.get('locale')).toBe('pt-BR');
    expect(url.searchParams.get('page')).toBe('ProjectsPage.ogPage');
    expect(url.searchParams.get('jobTitle')).toBe('OgCard.jobTitle');
  });

  it('should keep the caption as description when generated', async () => {
    const metadata = await metadataFor();

    expect(metadata.description).toBe('A great project');
    expect(metadata.openGraph?.description).toBe('A great project');
  });
});
