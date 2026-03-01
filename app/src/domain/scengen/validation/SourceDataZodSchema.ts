import z from 'zod';
import { EntityKind } from '@domain/scengen/types/EntityKind';
import { Lang } from '@shared/types/Lang';
import { Level } from '@domain/scengen/types/Level';
import { RelationTag } from '@domain/scengen/types/RelationTag';
import {
  RelationDataEntry,
  RelationEntry,
} from '@domain/scengen/types/SettingModel';
import * as object from '@shared/util/object';

const PartialLangs = z.partialRecord(z.enum(Lang), z.string());

const CommonSchema = z.object({
  id: z.string().nonempty(),
  parentId: z.string().nonempty().nullable(),
  name: PartialLangs,
  description: PartialLangs.optional(),
  url: PartialLangs.optional(),
  baseWeight: z.enum(Level).default(Level.NEGLIGIBLE),
  tags: z.array(z.string()).optional(),
  profileModifiers: z.record(z.string(), z.number()).optional(),
  relations: z
    .partialRecord(
      z.enum(RelationTag),
      z.array(z.record(z.string().nonempty(), z.enum(Level))),
    )
    .optional(),
});

const LocationSchema = CommonSchema.extend({
  kind: z.literal(EntityKind.LOCATION),
  securityLevel: z.enum(Level).default(Level.NEGLIGIBLE),
});

const FactionSchema = CommonSchema.extend({
  kind: z.literal(EntityKind.FACTION),
  securityLevel: z.enum(Level).default(Level.NEGLIGIBLE),
});

const ThemeSchema = CommonSchema.extend({
  kind: z.literal(EntityKind.THEME),
});

export const SourceDataZodSchema = z
  .discriminatedUnion('kind', [FactionSchema, LocationSchema, ThemeSchema])
  .transform((obj) => {
    const { relations, ...rest } = obj;
    const rels = object.entries(relations ?? {}).map(([tag, entries]) => [
      tag,
      entries.map((entry: RelationDataEntry) => {
        const [key, val] = Object.entries(entry)[0]!;
        return {
          entityId: key,
          weight: val,
        };
      }),
    ]) as [RelationTag, RelationEntry[]][];

    return { relations: rels, ...rest };
  });

export type SourceDataType = z.infer<typeof SourceDataZodSchema>;
