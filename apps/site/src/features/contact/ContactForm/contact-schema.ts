import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'required').min(3, 'min'),
  email: z.string().min(1, 'required').email('email'),
  message: z.string().min(1, 'required').min(10, 'min_message'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
