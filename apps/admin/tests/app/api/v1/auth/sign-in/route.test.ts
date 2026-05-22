import { NextRequest } from 'next/server';

vi.mock('~/lib/api/internal', () => ({
  getSiteApiUrl: vi.fn().mockReturnValue('http://localhost:3000'),
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

async function callRoute(body: unknown) {
  const { POST } = await import('~/app/api/v1/auth/sign-in/route');
  const request = new NextRequest('http://localhost:3001/api/v1/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(request);
}

describe('POST /api/v1/auth/sign-in (proxy)', () => {
  it('should forward the request body to the site API', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ data: null, error: null }),
      headers: { getSetCookie: () => [] },
    });

    await callRoute({ email: 'a@b.com', password: 'pass' });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/auth/sign-in',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('a@b.com'),
      }),
    );
  });

  it('should return the site API status and body', async () => {
    mockFetch.mockResolvedValue({
      status: 401,
      json: async () => ({
        data: null,
        error: { code: 'INVALID_CREDENTIALS', message: 'Bad credentials' },
      }),
      headers: { getSetCookie: () => [] },
    });

    const res = await callRoute({ email: 'a@b.com', password: 'wrong' });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should forward Set-Cookie headers from the site API', async () => {
    const cookies = [
      'sb-access-token=abc; HttpOnly; Path=/',
      'sb-refresh-token=xyz; HttpOnly; Path=/',
    ];
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ data: null, error: null }),
      headers: { getSetCookie: () => cookies },
    });

    const res = await callRoute({ email: 'a@b.com', password: 'pass' });

    const setCookie = res.headers.getSetCookie();
    expect(setCookie).toEqual(expect.arrayContaining(cookies));
  });

  it('should return 502 when the site API is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    const res = await callRoute({ email: 'a@b.com', password: 'pass' });

    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error.code).toBe('SITE_UNREACHABLE');
  });
});
