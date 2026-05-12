/**
 * @vitest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';

vi.mock('next-intl/middleware', () => ({
  default: vi.fn(() => vi.fn(() => NextResponse.next())),
}));

vi.mock('~/i18n/routing', () => ({
  routing: {
    locales: ['en-US', 'pt-BR', 'es'],
    defaultLocale: 'en-US',
  },
}));

describe('middleware', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should redirect to locale login when accessing admin without auth cookie', async () => {
    const { default: middleware } = await import('~/proxy');
    const request = new NextRequest('http://localhost:3000/en-US/admin');
    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/en-US/login');
  });

  it('should redirect to correct locale when accessing pt-BR admin without cookie', async () => {
    const { default: middleware } = await import('~/proxy');
    const request = new NextRequest(
      'http://localhost:3000/pt-BR/admin/dashboard',
    );
    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/pt-BR/login');
  });

  it('should allow access to admin when sb-access-token cookie is present', async () => {
    const { default: middleware } = await import('~/proxy');
    const request = new NextRequest('http://localhost:3000/en-US/admin', {
      headers: { cookie: 'sb-access-token=test-token' },
    });
    const response = middleware(request);

    expect(response.status).not.toBe(307);
  });

  it('should not redirect for non-admin paths without cookie', async () => {
    const { default: middleware } = await import('~/proxy');
    const request = new NextRequest('http://localhost:3000/en-US');
    const response = middleware(request);

    expect(response.status).not.toBe(307);
  });
});
