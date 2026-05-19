/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [{ name: 'session', value: 'abc123' }],
  }),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('~/lib/api/internal', () => ({
  getInternalBaseUrl: vi.fn().mockResolvedValue('http://localhost:3000'),
}));

vi.mock('~/app/[locale]/admin/_components/AdminSidebar', () => ({
  AdminSidebar: ({ locale }: { locale: string }) => (
    <div data-testid="admin-sidebar" data-locale={locale} />
  ),
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function renderLayout(locale = 'en-US') {
  const { default: AdminLayout } = await import(
    '~/app/[locale]/admin/layout'
  );
  return render(
    await AdminLayout({
      children: <div data-testid="child-content">Content</div>,
      params: Promise.resolve({ locale }),
    }),
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AdminLayout', () => {
  it('should redirect to login when /api/v1/me returns non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });

    await expect(renderLayout('en-US')).rejects.toThrow(
      'NEXT_REDIRECT:/en-US/login',
    );
  });

  it('should redirect to login with correct locale', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });

    await expect(renderLayout('pt-BR')).rejects.toThrow(
      'NEXT_REDIRECT:/pt-BR/login',
    );
  });

  it('should redirect to login when fetch throws a network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(renderLayout('en-US')).rejects.toThrow(
      'NEXT_REDIRECT:/en-US/login',
    );
  });

  it('should render children and sidebar when /api/v1/me returns ok', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    await renderLayout('en-US');

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
  });

  it('should pass locale to AdminSidebar', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    await renderLayout('pt-BR');

    expect(screen.getByTestId('admin-sidebar')).toHaveAttribute(
      'data-locale',
      'pt-BR',
    );
  });

  it('should forward cookies to the /api/v1/me request', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200 });

    await renderLayout('en-US');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/me',
      expect.objectContaining({
        headers: { cookie: 'session=abc123' },
        cache: 'no-store',
      }),
    );
  });
});
