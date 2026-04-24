import { z } from 'zod';

export const ContactRequestSchema = z.object({
  catcher: z
    .string()
    .optional()
    .refine((value) => typeof value === 'undefined' || value === '', {
      error: 'Catcher must be empty',
    }),
  name: z.string().min(1),
  email: z.email(),
  title: z.string().min(1),
  content: z.string().min(5),
});

export type ContactDto = z.infer<typeof ContactRequestSchema>;
