import { FC, useCallback, useState } from 'react';

import { Button, IToggleGroupProps } from '@repo/ui/Control';

export const ToggleStandard: FC = () => {
  const [value, setValue] = useState('a');

  console.log('ToggleStandard', value);

  const onChange: IToggleGroupProps['onChange'] = useCallback(
    (_, currentValue) => {
      setValue(currentValue);
    },
    [],
  );

  return (
    <Button.ToggleGroup value={value} onChange={onChange}>
      <>
        <Button.Toggle value="a">A</Button.Toggle>
        <Button.Toggle value="b">B</Button.Toggle>
        <Button.Toggle value="c">C</Button.Toggle>
      </>
    </Button.ToggleGroup>
  );
};
