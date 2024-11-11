import { type FC, createElement, memo, ForwardRefRenderFunction } from 'react';

import { useField } from 'formik';

interface WithFormikParams {
  type?: 'text' | 'checkbox';
  eventHandlers?: EventHandlers;
}

interface Props {
  name?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

type UseFieldProps = ReturnType<typeof useField>;

type CustomEvent = <P>(
  args: unknown[],
  useFieldProps: UseFieldProps,
  props: P,
) => void;

type EventHandlers = Record<string, CustomEvent>;

const createEvents =
  <P>([field, meta, helpers]: UseFieldProps, props: P) =>
  (events: EventHandlers) => {
    if (Object.keys(events).length === 0) return {};

    return Object.entries(events).reduce<EventHandlers>((acc, [key, value]) => {
      acc[key] = (...args) => {
        value(args, [field, meta, helpers], props);
      };

      return acc;
    }, {});
  };

export const withFormik =
  <P>(Component: FC<P> | ForwardRefRenderFunction<P>, hocsProps?: Partial<P>) =>
  (params: WithFormikParams) => {
    const DynamicComponent: FC<P> = (props) => {
      const [field, meta, helpers] = useField({
        name: (props as Props).name ?? (props as Props).id ?? '',
        type: ['text', 'checkbox'].includes(params.type ?? '')
          ? params.type
          : undefined,
      });

      const onBlur = (props as Props).onBlur ?? field.onBlur;
      const onChange = (props as Props).onChange ?? field.onChange(field.name);
      const events = {
        onBlur,
        onChange,
        ...createEvents(
          [field, meta, helpers],
          props,
        )(params.eventHandlers ?? {}),
      };

      return createElement(Component as FC<Record<string, unknown>>, {
        ...field,
        ...{ error: meta.error, touched: meta.touched },
        ...events,
        ...hocsProps,
        ...props,
      } satisfies P);
    };

    DynamicComponent.displayName = 'WithFormikHOC';

    return memo(DynamicComponent);
  };
