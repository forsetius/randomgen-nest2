import z from 'zod';
import { EntityKind } from '@domain/scengen/types/EntityKind';
import { Lang } from '@shared/types/Lang';
import { Level } from '@domain/scengen/types/Level';
import { RelationTag } from '@domain/scengen/types/RelationTag';

const PartialLangs = z.partialRecord(z.enum(Lang), z.string());

const CommonSchema = z.object({
  id: z.string().nonempty(),
  parentId: z.string().nonempty().nullable(),
  name: PartialLangs,
  description: PartialLangs.optional(),
  url: PartialLangs.optional(),
  importance: z.enum(Level).default(Level.NEGLIGIBLE),
});

const LocationSchema = CommonSchema.extend({
  kind: z.literal(EntityKind.LOCATION),
  securityLevel: z.enum(Level).default(Level.NEGLIGIBLE),
  relations: z
    .partialRecord(
      z.enum(RelationTag),
      z.record(z.string().nonempty(), z.enum(Level).default(Level.NEGLIGIBLE)),
    )
    .optional(),
}).transform(({ relations, ...rest }) => ({
  relations: relations ?? {},
  ...rest,
}));

const FactionSchema = CommonSchema.extend({
  kind: z.literal(EntityKind.FACTION),
  securityLevel: z.enum(Level).default(Level.NEGLIGIBLE),
  relations: z
    .partialRecord(
      z.enum(RelationTag),
      z.record(z.string().nonempty(), z.enum(Level).default(Level.NEGLIGIBLE)),
    )
    .optional(),
});

export const SourceDataZodSchema = z.discriminatedUnion('kind', [
  FactionSchema,
  LocationSchema,
]);

export type SourceDataType = z.infer<typeof SourceDataZodSchema>;
