/**
 * @vitest-environment node
 */
import { type Container, getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { POST } from '~/app/api/v1/contact/route';

vi.mock('@repo/infra', () => ({
  getContainer: vi.fn(),
}));

const mockSend = vi.fn();

beforeEach(() => {
  vi.mocked(getContainer).mockReturnValue({
    emailService: { send: mockSend },
  } as unknown as Container);
});

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/v1/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/v1/contact', () => {
  it('should return 400 when body is null', async () => {
    const request = new NextRequest('http://localhost/api/v1/contact', {
      method: 'POST',
      body: 'not-json{{{',
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_INPUT');
  });

  it('should return 400 when body is not an object', async () => {
    const request = new NextRequest('http://localhost/api/v1/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(42),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_INPUT');
  });

  it('should return 400 when name is missing', async () => {
    const response = await POST(
      makeRequest({ name: '', email: 'a@b.com', message: 'hello' }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_NAME');
  });

  it('should return 400 when email is invalid', async () => {
    const response = await POST(
      makeRequest({ name: 'Alice', email: 'not-an-email', message: 'hello' }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_EMAIL');
  });

  it('should return 201 when email service succeeds', async () => {
    const { right } = await import('@repo/core/shared');
    mockSend.mockResolvedValue(right(undefined));

    const response = await POST(
      makeRequest({ name: 'Alice', email: 'alice@example.com', message: 'hello' }),
    );

    expect(response.status).toBe(201);
  });

  it('should return 500 when email service throws', async () => {
    mockSend.mockRejectedValue(new Error('SMTP failure'));

    const response = await POST(
      makeRequest({ name: 'Alice', email: 'alice@example.com', message: 'hello' }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
