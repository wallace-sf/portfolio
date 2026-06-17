'use client';

import { FC, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Label, Text, TextArea } from '@repo/ui/Control';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { contactSchema, ContactFormValues } from './contact-schema';

export const ContactForm: FC = () => {
  const tForm = useTranslations('ContactForm');
  const tV = useTranslations('Validations');
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    const subject = encodeURIComponent(tForm('subject'));
    const body = encodeURIComponent(
      `${data.name} <${data.email}>\n\n${data.message}`,
    );
    window.location.href = `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-content-primary mb-6">
          {tForm('title')}
        </h2>
        <p className="text-accent">{tForm('success')}</p>
      </div>
    );
  }

  return (
    <>
      <h2
        id="contact-form-title"
        className="text-2xl font-bold text-content-primary mb-6"
      >
        {tForm('title')}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
        <fieldset
          aria-labelledby="contact-form-title"
          className="border-0 p-0 m-0 min-w-0"
        >
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col xl:flex-row gap-y-6 xl:gap-x-4">
              <div className="flex flex-col gap-y-1 xl:flex-1">
                <Label htmlFor="name">{tForm('nameLabel')}</Label>
                <Text.Base
                  type="text"
                  id="name"
                  placeholder={tForm('namePlaceholder')}
                  error={!!errors.name}
                  touched={!!touchedFields.name}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  {...register('name')}
                />
                {errors.name && (
                  <span
                    id="name-error"
                    role="alert"
                    className="text-error text-xs"
                  >
                    {tV(errors.name.message as Parameters<typeof tV>[0])}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-y-1 xl:flex-1">
                <Label htmlFor="email">{tForm('emailLabel')}</Label>
                <Text.Base
                  type="email"
                  id="email"
                  placeholder={tForm('emailPlaceholder')}
                  error={!!errors.email}
                  touched={!!touchedFields.email}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
                {errors.email && (
                  <span
                    id="email-error"
                    role="alert"
                    className="text-error text-xs"
                  >
                    {tV(errors.email.message as Parameters<typeof tV>[0])}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-y-1">
              <Label htmlFor="message">{tForm('messageLabel')}</Label>
              <TextArea.Base
                id="message"
                maxLength={2000}
                className="h-[124px]"
                placeholder={tForm('messagePlaceholder')}
                error={!!errors.message}
                touched={!!touchedFields.message}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                {...register('message')}
              />
              {errors.message && (
                <span
                  id="message-error"
                  role="alert"
                  className="text-error text-xs"
                >
                  {tV(errors.message.message as Parameters<typeof tV>[0])}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        <Button.Base
          type="submit"
          className="w-full lg:w-[216px] h-[46px] mt-6"
          disabled={isSubmitting}
        >
          {tForm('submit')}
        </Button.Base>
      </form>
    </>
  );
};
