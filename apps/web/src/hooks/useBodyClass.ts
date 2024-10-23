import { useIsomorphicLayoutEffect, useIsClient } from 'usehooks-ts';

export const useBodyClass = (className: string) => {
  const isClient = useIsClient();

  useIsomorphicLayoutEffect(() => {
    if (isClient && className) document.body.classList.add(className);

    return () => {
      if (isClient && className) document.body.classList.remove(className);
    };
  }, [className]);
};
