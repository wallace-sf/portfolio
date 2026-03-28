/**
 * @jest-environment node
 */
import { DomainError, NotFoundError, ValidationError, right, left } from '@repo/core/shared';

const mockExecute = jest.fn();

jest.mock('@repo/infra', () => ({
  getContainer: jest.fn(() => ({
    projectRepository: {},
  })),
}));

jest.mock('@repo/application/portfolio', () => ({
  GetProjectBySlug: jest.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));

describe('GET /api/v1/projects/[slug]', () => {
  const makeRequest = (slug: string, locale?: string) => {
    const url = `http://localhost/api/v1/projects/${slug}${locale ? `?locale=${locale}` : ''}`;
    return new Request(url);
  };

  it('should return 200 with project data when found', async () => {
    const projectData = { id: '1', slug: 'my-project', title: 'My Project' };
    mockExecute.mockResolvedValueOnce(right(projectData));

    const { GET } = await import('./route');
    const response = await GET(makeRequest('my-project', 'en-US'), {
      params: { slug: 'my-project' },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, data: projectData });
  });

  it('should return 404 when project is not found', async () => {
    mockExecute.mockResolvedValueOnce(left(new NotFoundError({ slug: 'unknown' })));

    const { GET } = await import('./route');
    const response = await GET(makeRequest('unknown'), { params: { slug: 'unknown' } });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('should return 422 when slug is invalid', async () => {
    mockExecute.mockResolvedValueOnce(
      left(new ValidationError({ code: 'INVALID_SLUG', message: 'Invalid slug' })),
    );

    const { GET } = await import('./route');
    const response = await GET(makeRequest('INVALID SLUG'), { params: { slug: 'INVALID SLUG' } });
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INVALID_SLUG');
  });

  it('should return 500 on unexpected domain error', async () => {
    mockExecute.mockResolvedValueOnce(
      left(new DomainError('FETCH_FAILED', { message: 'DB down' })),
    );

    const { GET } = await import('./route');
    const response = await GET(makeRequest('my-project'), { params: { slug: 'my-project' } });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.message).toBe('Internal server error');
  });

  it('should default to DEFAULT_LOCALE when locale param is missing', async () => {
    const projectData = { id: '1', slug: 'my-project' };
    mockExecute.mockResolvedValueOnce(right(projectData));

    const { GET } = await import('./route');
    await GET(makeRequest('my-project'), { params: { slug: 'my-project' } });

    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'pt-BR' }),
    );
  });

  it('should use provided locale when valid', async () => {
    const projectData = { id: '1', slug: 'my-project' };
    mockExecute.mockResolvedValueOnce(right(projectData));

    const { GET } = await import('./route');
    await GET(makeRequest('my-project', 'en-US'), { params: { slug: 'my-project' } });

    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'en-US' }),
    );
  });
});
