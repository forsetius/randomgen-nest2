import { z } from 'zod';

const CommonMenuZodSchema = z.object({
  name: z.string(),
  template: z.string(),
  text: z.string(),
  img: z.string().optional(),
});

export const MenuItemZodSchema = CommonMenuZodSchema.extend({
  url: z.string().url(),
});

export const SubMenuZodSchema = CommonMenuZodSchema.extend({
  menu: z.record(z.string(), MenuItemZodSchema),
});

export const MenuZodSchema = z.array(MenuItemZodSchema.or(SubMenuZodSchema));

export type MenuDef = z.infer<typeof MenuZodSchema>;
