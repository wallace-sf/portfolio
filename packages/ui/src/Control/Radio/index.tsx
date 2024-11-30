'use client';

import { FC, MouseEventHandler, useCallback, useMemo } from 'react';

import classNames from 'classnames';

import { Icon, IconProps } from '~imagery/Icon';
export interface IRadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'className' | 'children'
  > {
  icon?: IconProps['icon'];
  option: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  children?:
    | React.ReactNode
    | ((props: { checked: boolean }) => React.ReactNode);
}

export const Radio: FC<IRadioProps> = ({
  option,
  value,
  labelProps,
  children,
  icon,
  ...props
}) => {
  const checked = useMemo(() => value === option, [value, option]);

  const onClick = useCallback<MouseEventHandler<HTMLLabelElement>>((e) => {
    e.stopPropagation();
  }, []);

  return (
    <label
      {...labelProps}
      id={`${props.id ?? ''}-label`}
      htmlFor={props.id}
      className={classNames(
        'flex items-center gap-x-2 cursor-pointer',
        labelProps?.className,
      )}
      onClick={onClick}
      role="presentation"
    >
      <div className="grid place-items-center">
        <input
          {...props}
          value={option}
          type="radio"
          checked={checked}
          className="peer col-start-1 row-start-1 appearance-none shrink-0 w-4 h-4 border-2 border-white rounded-full focus:outline-none focus:ring-offset-0 disabled:border-gray-400 cursor-pointer
"
        />
        {checked ? (
          <span className="pointer-events-none col-start-1 row-start-1 w-2 h-2 rounded-full peer-checked:bg-white peer-checked:peer-disabled:bg-gray-400" />
        ) : null}
      </div>
      <Icon icon={icon} />
      <span className="text-body-xs !text-white text-start">
        {children instanceof Function ? children({ checked }) : children}
      </span>
    </label>
  );
};
