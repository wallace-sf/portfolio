import { renderHook, act } from '@testing-library/react';

import { useThrottle } from '../../src';

describe('useThrottle', () => {
  it('should throttle the function calls', () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const { result } = renderHook(() => useThrottle(fn));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    vi.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should call the throttled function again after the interval', () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const { result } = renderHook(() => useThrottle(fn, 500));

    act(() => {
      result.current();
    });

    vi.advanceTimersByTime(500);

    act(() => {
      result.current();
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should call the function immediately when leading is true', () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const { result } = renderHook(() =>
      useThrottle(fn, 500, { leading: true }),
    );

    act(() => {
      result.current();
    });

    vi.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should not call the function immediately when leading is false', () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const { result } = renderHook(() =>
      useThrottle(fn, 500, { leading: false, trailing: false }),
    );

    act(() => {
      result.current();
    });

    vi.advanceTimersByTime(500);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should call the function at the end when trailing is true', () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const { result } = renderHook(() =>
      useThrottle(fn, 500, { leading: false, trailing: true }),
    );

    act(() => {
      result.current();
      result.current();
    });

    vi.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
