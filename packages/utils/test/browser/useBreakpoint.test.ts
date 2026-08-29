import { renderHook } from '@testing-library/react';

import { useBreakpoint } from '../../src/hooks';

const mediaQuery = vi.hoisted(() => vi.fn());

vi.mock('usehooks-ts', () => ({
  useMediaQuery: (query: string) => mediaQuery(query),
}));

describe('useBreakpoint', () => {
  it('should query the min-width for the given breakpoint token', () => {
    mediaQuery.mockReturnValue(false);

    renderHook(() => useBreakpoint('lg'));

    expect(mediaQuery).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('should return true when the media query matches', () => {
    mediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useBreakpoint('md'));

    expect(result.current).toBe(true);
  });

  it('should return false when the media query does not match', () => {
    mediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useBreakpoint('xl'));

    expect(result.current).toBe(false);
  });
});
