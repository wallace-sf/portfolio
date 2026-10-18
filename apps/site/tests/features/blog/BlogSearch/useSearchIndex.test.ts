/**
 * @vitest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSearchIndex } from '~features/blog/BlogSearch/useSearchIndex';

const respond = (body: unknown, ok = true) =>
  vi
    .fn()
    .mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => body });

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useSearchIndex', () => {
  it('should not request the index until load is called', () => {
    const fetchMock = respond([]);
    vi.stubGlobal('fetch', fetchMock);

    renderHook(() => useSearchIndex('en-US'));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should fetch the locale-prefixed index once and expose bodies by slug when load is called twice', async () => {
    const fetchMock = respond([{ slug: 'either', text: 'Return one left.' }]);
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useSearchIndex('pt-BR'));

    act(() => {
      result.current.load();
      result.current.load();
    });

    await waitFor(() =>
      expect(result.current.bodies).toEqual({ either: 'Return one left.' }),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/pt-BR/blog/search-index.json');
  });

  it('should keep bodies empty and log when the request fails', async () => {
    vi.stubGlobal('fetch', respond(null, false));
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useSearchIndex('en-US'));

    act(() => result.current.load());

    await waitFor(() => expect(error).toHaveBeenCalled());
    expect(result.current.bodies).toEqual({});
  });

  it('should skip malformed entries when the payload has unexpected items', async () => {
    vi.stubGlobal(
      'fetch',
      respond([{ slug: 'ok', text: 'fine' }, { slug: 1 }, 'junk']),
    );
    const { result } = renderHook(() => useSearchIndex('en-US'));

    act(() => result.current.load());

    await waitFor(() => expect(result.current.bodies).toEqual({ ok: 'fine' }));
  });
});
