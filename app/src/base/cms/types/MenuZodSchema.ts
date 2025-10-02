import { z } from 'zod';

export const SimpleMenuItemZodSchema = z.object({
  title: z.string(),
  url: z.string(),
});

export const SimpleSubMenuZodSchema = z.object({
  title: z.string(),
  items: z.array(SimpleMenuItemZodSchema),
});

export const RichSubMenuZodSchema = z.object({
  title: z.string(),
  url: z.string().optional(),
  text: z.string().optional(),
  columns: z.array(
    z.object({
      title: z.string(),
      url: z.string().optional(),
      text: z.string().optional(),
      colspan: z.number().int().min(1).max(6).default(1),
      repeatTitle: z.boolean().default(false),
      items: z.array(
        z.object({
          title: z.string(),
          url: z.string(),
          text: z.string().optional(),
        }),
      ),
    }),
  ),
});

export const SeparatorMenuItemZodSchema = z.object({
  separator: z.string(),
});

export const LabelMenuItemZodSchema = z.object({
  label: z.string(),
});

export const MenuZodSchema = z.object({
  template: z.string(),
  class: z.string().optional(),
  menu: z.array(
    SimpleMenuItemZodSchema.or(SimpleSubMenuZodSchema)
      .or(RichSubMenuZodSchema)
      .or(SeparatorMenuItemZodSchema)
      .or(LabelMenuItemZodSchema),
  ),
});

export type MenuDef = z.infer<typeof MenuZodSchema>;
