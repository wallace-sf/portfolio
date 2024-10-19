'use client';

import { FC, useCallback, useId, type ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import { Tooltip } from 'react-tooltip';
import { useBoolean, useCopyToClipboard } from 'usehooks-ts';

import { useThrottle } from '~hooks';

import { ButtonBase, IButtonBaseProps } from '../Base';

export type ClipboardChildrenFn = (copied: boolean) => ReactNode;

export interface IButtonClipboardProps
  extends Omit<IButtonBaseProps, 'children' | 'onClick' | 'data-tooltip-id'> {
  text: string;
  children: ClipboardChildrenFn | ReactNode;
}

export const Clipboard: FC<IButtonClipboardProps> = ({
  className,
  text,
  children,
  ...props
}) => {
  const t = useTranslations('Clipboard');
  const tooltipId = useId();
  const [, copy] = useCopyToClipboard();
  const {
    value: copied,
    setTrue: setCopiedTrue,
    setFalse: setCopiedFalse,
  } = useBoolean(false);
  const throttle = useThrottle(
    () => {
      setCopiedFalse();
    },
    2000,
    { trailing: true, leading: false },
  );

  const handleCopy = useCallback(() => {
    copy(text).then(() => {
      setCopiedTrue();
      throttle();
    });
  }, [copy, setCopiedTrue, text, throttle]);

  return (
    <>
      <ButtonBase
        {...props}
        onClick={handleCopy}
        data-tooltip-id={tooltipId}
        className={className}
      >
        {children instanceof Function ? children(copied) : children}
      </ButtonBase>
      <Tooltip id={tooltipId} place="bottom" className="z-40">
        {t('copy')}
      </Tooltip>
    </>
  );
};
