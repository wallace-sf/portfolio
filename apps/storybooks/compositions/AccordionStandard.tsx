import { FC } from 'react';

import { Accordion } from '@repo/ui/Control';

export const AccordionStandard: FC = () => {
  return (
    <Accordion.Root>
      <Accordion.Header>Click me to collapse</Accordion.Header>
      <Accordion.Body>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate ea
        ad impedit cum tenetur, odit magni numquam quia quo maiores ducimus
        laborum. Ipsam quasi ex neque sapiente sunt illo cupiditate?
      </Accordion.Body>
    </Accordion.Root>
  );
};
