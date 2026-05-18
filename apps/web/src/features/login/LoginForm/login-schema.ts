import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'required').email('email'),
  password: z.string().min(1, 'required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
