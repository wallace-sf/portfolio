import { FC, PropsWithChildren } from 'react';

export const Container: FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex flex-row items-center gap-x-2">{children}</div>;
};
