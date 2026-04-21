/**
 * @jest-environment node
 */
import { getContainer } from '@repo/infra';
import { NextRequest } from 'next/server';

import { GET as GETBySlug } from '../[slug]/route';
import { GET } from '../route';

jest.mock('@repo/infra', () => ({
  getContainer: jest.fn(),
}));

const mockFindPublished = jest.fn();
const mockFindBySlug = jest.fn();
const mockFindRelated = jest.fn();

beforeEach(() => {
  (getContainer as jest.Mock).mockReturnValue({
    projectRepository: {
      findPublished: mockFindPublished,
      findBySlug: mockFindBySlug,
      findRelated: mockFindRelated,
    },
  });
  mockFindRelated.mockResolvedValue([]);
});

function makeRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe('GET /api/v1/projects', () => {
  it('should return 200 with empty data array when no projects exist', async () => {
    mockFindPublished.mockResolvedValue([]);

    const response = await GET(makeRequest('http://localhost/api/v1/projects'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.error).toBeNull();
  });

  it('should return 500 when repository throws', async () => {
    mockFindPublished.mockRejectedValue(new Error('DB connection failed'));

    const response = await GET(makeRequest('http://localhost/api/v1/projects'));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.data).toBeNull();
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});

describe('GET /api/v1/projects/[slug]', () => {
  it('should return 400 when slug is invalid', async () => {
    const request = makeRequest('http://localhost/api/v1/projects/ab');
    const response = await GETBySlug(request, { params: { slug: 'ab' } });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.data).toBeNull();
    expect(body.error.code).toBeDefined();
  });

  it('should return 404 when project does not exist', async () => {
    mockFindBySlug.mockResolvedValue(null);

    const request = makeRequest('http://localhost/api/v1/projects/my-project');
    const response = await GETBySlug(request, {
      params: { slug: 'my-project' },
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.data).toBeNull();
    expect(body.error.code).toBe('NOT_FOUND');
  });
});
