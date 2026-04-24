import { useEffect, useRef } from 'react';

import _throttle from 'lodash/throttle';

import { type NoopFunction } from '../types';

interface IThrottleSettings {
  leading?: boolean;
  trailing?: boolean;
}

export const useThrottle = <T extends NoopFunction>(
  fn: T,
  interval = 500,
  options?: IThrottleSettings,
) => {
  const ref = useRef(_throttle(fn, interval, options));

  useEffect(() => {
    const current = ref.current;

    return () => {
      current.cancel();
    };
  }, []);

  return ref.current;
};
