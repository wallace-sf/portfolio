import { Divider } from '@repo/ui/View';

import { ContactForm } from '~features/contact/ContactForm';
import { ContactInfo } from '~features/contact/ContactInfo';

export function ContactSection() {
  return (
    <section className="flex flex-col gap-x-6 xl:flex-row mx-4 xl:mx-auto xl:w-full xl:max-w-237.5">
      <ContactForm />
      <Divider className="xl:hidden" />
      <ContactInfo />
    </section>
  );
}
