'use client';

import { FC, useCallback, useMemo } from 'react';

import { Button, TextArea } from '@repo/ui/Control';
import { Formik, Form } from 'formik';
import { useTranslations } from 'next-intl';
import { useIsClient } from 'usehooks-ts';

import { IContactFormValues } from './types';
import { INITIAL_VALUES, createValidationSchema } from './utils';

export const ContactForm: FC = () => {
  const tContactForm = useTranslations('ContactForm');
  const tValidations = useTranslations('Validations');
  const isClient = useIsClient();

  const onSubmit = useCallback(
    (values: IContactFormValues) => {
      if (isClient) {
        const a = document.createElement('a');
        const { message } = values;

        a.href =
          'mailto:' +
          encodeURIComponent('wallaceedua@gmail.com') +
          '?subject=' +
          encodeURIComponent(tContactForm('subject')) +
          '&body=' +
          encodeURIComponent(message);

        a.click();
      }
    },
    [isClient, tContactForm],
  );

  const validationSchema = useMemo(() => {
    const required = tValidations('required');
    const min = tValidations('min');

    return createValidationSchema({ message: { required, min } });
  }, [tValidations]);

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form className="w-full">
        <h5 className="!text-white mb-6">{tContactForm('title')}</h5>
        <fieldset className="w-full mb-6">
          <TextArea.WithFormik
            id="message"
            name="message"
            maxLength={2000}
            className="min-h-32"
            placeholder={tContactForm('messagePlaceholder')}
          />
        </fieldset>
        <Button.Base type="submit" className="w-full xl:max-w-50">
          {tContactForm('submit')}
        </Button.Base>
      </Form>
    </Formik>
  );
};
