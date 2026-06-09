'use client';

import { ContactForm } from '~features/contact/ContactForm';
import { ContactInfo } from '~features/contact/ContactInfo';

export function ContactSection() {
  return (
    <section className="bg-surface-overlay xl:border-2 xl:border-b-0 xl:border-border-subtle py-10 xl:-mx-[161px] xl:px-[161px]">
      <div className="mx-4 xl:mx-auto flex flex-col gap-y-6 xl:flex-row xl:gap-x-16">
        <div className="xl:w-[560px] shrink-0">
          <ContactForm />
        </div>
        <ContactInfo />
      </div>
    </section>
  );
}
