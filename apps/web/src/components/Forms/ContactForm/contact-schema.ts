import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'required'),
  email: z.string().min(1, 'required').email('email'),
  message: z.string().min(1, 'required'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
