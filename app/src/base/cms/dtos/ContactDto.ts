import { z } from 'zod';

export const ContactRequestSchema = z.object({
  catcher: z
    .string()
    .optional()
    .refine((val) => typeof val === 'undefined' || val === ''),
  name: z.string().min(1),
  email: z.email(),
  title: z.string().min(1),
  content: z.string().min(1),
});

export type ContactDto = z.infer<typeof ContactRequestSchema>;
