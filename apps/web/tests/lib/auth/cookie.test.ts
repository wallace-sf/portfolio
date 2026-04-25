/**
 * @vitest-environment node
 */
import { vi } from 'vitest';

import { createNextAuthCookieApi } from '~/lib/auth/cookie';

type MockStore = {
  store: Record<string, string>;
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const mockCookieStore: MockStore = {
  store: {},
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

beforeEach(() => {
  mockCookieStore.store = {};
  vi.clearAllMocks();
  mockCookieStore.get.mockImplementation((name: string) => {
    const value = mockCookieStore.store[name];
    return value !== undefined ? { name, value } : undefined;
  });
  mockCookieStore.set.mockImplementation((name: string, value: string) => {
    mockCookieStore.store[name] = value;
  });
  mockCookieStore.delete.mockImplementation((name: string) => {
    delete mockCookieStore.store[name];
  });
});

describe('createNextAuthCookieApi', () => {
  it('should return undefined when cookie does not exist', () => {
    const api = createNextAuthCookieApi();
    expect(api.get('missing')).toBeUndefined();
  });

  it('should return cookie value when cookie exists', () => {
    mockCookieStore.store['sb-access-token'] = 'my-token';
    const api = createNextAuthCookieApi();
    expect(api.get('sb-access-token')).toBe('my-token');
  });

  it('should set cookie via underlying cookie store', () => {
    const api = createNextAuthCookieApi();
    api.set('sb-access-token', 'access-123', { httpOnly: true, path: '/' });
    expect(mockCookieStore.set).toHaveBeenCalledWith('sb-access-token', 'access-123', {
      httpOnly: true,
      path: '/',
    });
  });

  it('should delete cookie via underlying cookie store', () => {
    const api = createNextAuthCookieApi();
    api.delete('sb-refresh-token');
    expect(mockCookieStore.delete).toHaveBeenCalledWith('sb-refresh-token');
  });

  it('should set with empty options when no options provided', () => {
    const api = createNextAuthCookieApi();
    api.set('name', 'value');
    expect(mockCookieStore.set).toHaveBeenCalledWith('name', 'value', {});
  });
});
