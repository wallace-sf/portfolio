import { useEffect, useRef } from 'react';

import _throttle from 'lodash/throttle';

import { type NoopFunction } from '~types';

interface ThrottleSettings {
  leading?: boolean;
  trailing?: boolean;
}

export const useThrottleFn = <T extends NoopFunction>(
  fn: T,
  interval = 500,
  options?: ThrottleSettings,
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
