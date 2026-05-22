import { NextRequest } from 'next/server';

vi.mock('~/lib/api/internal', () => ({
  getSiteApiUrl: vi.fn().mockReturnValue('http://localhost:3000'),
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

async function callRoute(cookieHeader = '') {
  const { POST } = await import('~/app/api/v1/auth/sign-out/route');
  const request = new NextRequest(
    'http://localhost:3001/api/v1/auth/sign-out',
    {
      method: 'POST',
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    },
  );
  return POST(request);
}

describe('POST /api/v1/auth/sign-out (proxy)', () => {
  it('should forward the cookie header to the site API', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ data: null, error: null }),
      headers: { getSetCookie: () => [] },
    });

    await callRoute('sb-access-token=abc; sb-refresh-token=xyz');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/auth/sign-out',
      expect.objectContaining({
        method: 'POST',
        headers: { cookie: 'sb-access-token=abc; sb-refresh-token=xyz' },
      }),
    );
  });

  it('should return the site API status and body', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ data: null, error: null }),
      headers: { getSetCookie: () => [] },
    });

    const res = await callRoute();

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.error).toBeNull();
  });

  it('should forward Set-Cookie headers that clear the session', async () => {
    const cookies = [
      'sb-access-token=; Max-Age=0; Path=/',
      'sb-refresh-token=; Max-Age=0; Path=/',
    ];
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ data: null, error: null }),
      headers: { getSetCookie: () => cookies },
    });

    const res = await callRoute('sb-access-token=abc');

    const setCookie = res.headers.getSetCookie();
    expect(setCookie).toEqual(expect.arrayContaining(cookies));
  });

  it('should return 502 when the site API is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    const res = await callRoute();

    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error.code).toBe('SITE_UNREACHABLE');
  });
});
