'use client';

import { ContactForm } from '~features/contact/ContactForm';
import { ContactInfo } from '~features/contact/ContactInfo';

export function ContactSection() {
  return (
    <section className="bg-surface-overlay xl:border-2 xl:border-b-0 xl:border-border-subtle py-10 2xl:-mx-[161px] 2xl:px-[161px]">
      <div className="mx-4 xl:mx-8 flex flex-col gap-y-6 xl:flex-row xl:gap-x-8 2xl:gap-x-16">
        <div className="xl:w-[560px] xl:shrink-0">
          <ContactForm />
        </div>
        <ContactInfo />
      </div>
    </section>
  );
}
