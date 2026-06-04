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

  it('should delegate to next-intl middleware for any path', async () => {
    const { default: middleware } = await import('~/proxy');
    const request = new NextRequest('http://localhost:3000/en-US');
    const response = middleware(request);

    expect(response.status).not.toBe(307);
  });

  it('should delegate to next-intl middleware for admin paths', async () => {
    const { default: middleware } = await import('~/proxy');
    const request = new NextRequest('http://localhost:3000/en-US/admin');
    const response = middleware(request);

    expect(response.status).not.toBe(307);
  });
});
