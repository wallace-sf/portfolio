import { renderHook, act } from '@testing-library/react';

import { useThrottle } from '../../src';

describe('useThrottle', () => {
  it('should throttle the function calls', () => {
    jest.useFakeTimers();

    const fn = jest.fn();
    const { result } = renderHook(() => useThrottle(fn));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    jest.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should call the throttled function again after the interval', () => {
    jest.useFakeTimers();

    const fn = jest.fn();
    const { result } = renderHook(() => useThrottle(fn, 500));

    act(() => {
      result.current();
    });

    jest.advanceTimersByTime(500);

    act(() => {
      result.current();
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should call the function immediately when leading is true', () => {
    jest.useFakeTimers();

    const fn = jest.fn();
    const { result } = renderHook(() =>
      useThrottle(fn, 500, { leading: true }),
    );

    act(() => {
      result.current();
    });

    jest.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should not call the function immediately when leading is false', () => {
    jest.useFakeTimers();

    const fn = jest.fn();
    const { result } = renderHook(() =>
      useThrottle(fn, 500, { leading: false, trailing: false }),
    );

    act(() => {
      result.current();
    });

    jest.advanceTimersByTime(500);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should call the function at the end when trailing is true', () => {
    jest.useFakeTimers();

    const fn = jest.fn();
    const { result } = renderHook(() =>
      useThrottle(fn, 500, { leading: false, trailing: true }),
    );

    act(() => {
      result.current();
      result.current();
    });

    jest.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
