/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({ get: () => 'localhost:3000' }),
}));

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('en-US'),
}));

vi.mock('~/lib/api/internal', () => ({
  getInternalBaseUrl: vi.fn().mockResolvedValue('http://localhost:3000'),
}));

vi.mock('next/navigation', () => ({
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

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

const PROJECT = {
  id: '1',
  slug: 'my-project',
  title: 'My Project',
  caption: 'A great project',
  coverImage: { url: 'https://example.com/img.jpg', alt: 'Cover' },
  skills: [{ name: 'React', icon: '' }],
  content: '# Hello',
  period: { startAt: '2024-01-01' },
  relatedProjects: [],
};

function mockApiOk(data: unknown) {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ data, error: null }),
  });
}

function mockApiError(status: number) {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    json: async () => ({
      data: null,
      error: { code: 'NOT_FOUND', message: '' },
    }),
  });
}

describe('ProjectDetailPage', () => {
  it('should render project detail when API returns data', async () => {
    mockApiOk(PROJECT);
    const { default: Page } = await import(
      '~/app/[locale]/projects/[slug]/page'
    );
    render(await Page({ params: Promise.resolve({ slug: 'my-project' }) }));
    expect(screen.getByTestId('project-detail')).toBeInTheDocument();
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('should call notFound when API returns 404', async () => {
    mockApiError(404);
    const { notFound } = await import('next/navigation');
    const { default: Page } = await import(
      '~/app/[locale]/projects/[slug]/page'
    );
    await expect(
      Page({ params: Promise.resolve({ slug: 'missing' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('should call notFound when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const { notFound } = await import('next/navigation');
    const { default: Page } = await import(
      '~/app/[locale]/projects/[slug]/page'
    );
    await expect(
      Page({ params: Promise.resolve({ slug: 'my-project' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('should call notFound when API returns an error envelope', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: null,
        error: { code: 'INTERNAL', message: 'fail' },
      }),
    });
    const { notFound } = await import('next/navigation');
    const { default: Page } = await import(
      '~/app/[locale]/projects/[slug]/page'
    );
    await expect(
      Page({ params: Promise.resolve({ slug: 'my-project' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
