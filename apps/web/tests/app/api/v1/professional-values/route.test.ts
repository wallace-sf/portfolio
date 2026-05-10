/**
 * @vitest-environment node
 */
import { type Container, getContainer } from '@repo/infra';

import { GET } from '~/app/api/v1/professional-values/route';

vi.mock('@repo/infra', () => ({
  getContainer: vi.fn(),
}));

const mockFindAll = vi.fn();

beforeEach(() => {
  vi.mocked(getContainer).mockReturnValue({
    professionalValueRepository: {
      findAll: mockFindAll,
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as Container);
});

describe('GET /api/v1/professional-values', () => {
  it('should return 200 with empty array when no values exist', async () => {
    mockFindAll.mockResolvedValue([]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.error).toBeNull();
  });

  it('should return 500 when repository throws', async () => {
    mockFindAll.mockRejectedValue(new Error('DB connection failed'));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.data).toBeNull();
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
