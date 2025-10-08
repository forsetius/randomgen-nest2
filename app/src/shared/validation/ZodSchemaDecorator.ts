import 'reflect-metadata';
import { SetMetadata } from '@nestjs/common';
import { z } from 'zod';
import type { AppConfigService } from '@config/AppConfigService';

export const ZOD_REQUEST_SCHEMA_KEY = 'zod:request-schema';

export interface ZodRequestSchemaMeta {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
  headers?: z.ZodType;
}

export type ZodSchemaFactory = (
  config: AppConfigService,
) => ZodRequestSchemaMeta;

export const ZodSchema = (
  schemaOrFactory: ZodRequestSchemaMeta | ZodSchemaFactory,
): MethodDecorator & ClassDecorator =>
  SetMetadata(ZOD_REQUEST_SCHEMA_KEY, schemaOrFactory);
