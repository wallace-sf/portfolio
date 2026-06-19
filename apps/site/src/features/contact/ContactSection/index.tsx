'use client';

import dynamic from 'next/dynamic';

import { ContactInfo } from '~features/contact/ContactInfo';

const ContactForm = dynamic(
  () => import('~features/contact/ContactForm').then((m) => m.ContactForm),
  { ssr: false },
);

export function ContactSection() {
  return (
    <section className="bg-surface-overlay py-10 xl:border-2 xl:border-b-0 xl:border-border-subtle 2xl:mx-[-161px] 2xl:px-[161px]">
      <div className="mx-4 flex flex-col gap-y-6 xl:mx-8 xl:flex-row xl:gap-x-8 2xl:gap-x-16">
        <div className="xl:w-[560px] xl:shrink-0">
          <ContactForm />
        </div>
        <ContactInfo />
      </div>
    </section>
  );
}
