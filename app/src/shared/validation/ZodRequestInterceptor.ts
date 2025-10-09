import { Injectable, BadRequestException } from '@nestjs/common';
import type {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { type Observable, from, switchMap } from 'rxjs';
import z from 'zod';
import type { AppConfigService } from '@config/AppConfigService';
import { findDuplicates } from '@shared/util/array';
import { isRecord } from '@shared/util/isType';
import {
  ZOD_REQUEST_SCHEMA_KEY,
  type ZodRequestSchemaMeta,
  type ZodSchemaFactory,
} from './ZodSchemaDecorator';
import type { ParsedRequest } from './express-augmentations';
import { Env } from '@shared/types/Env';

const mergeRecords = (sources: unknown[]): Record<string, unknown> => {
  const args = sources
    .map((source) => (isRecord(source) ? Object.entries(source) : []))
    .flat();

  const argNames = args.map(([key]) => key);
  if (new Set(argNames).size !== argNames.length) {
    const duplicates = findDuplicates(argNames).join(', ');
    throw new BadRequestException(
      `Duplicates in request arguments: ${duplicates}`,
    );
  }

  return Object.fromEntries(args);
};

@Injectable()
export class ZodRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: AppConfigService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const meta = this.reflector.getAllAndOverride<
      ZodRequestSchemaMeta | ZodSchemaFactory | undefined
    >(ZOD_REQUEST_SCHEMA_KEY, [context.getHandler(), context.getClass()]);

    const schema = typeof meta === 'function' ? meta(this.configService) : meta;
    if (!schema) return next.handle();

    const req = context.switchToHttp().getRequest<ParsedRequest>();

    const validate = async () => {
      const parse = async (schema?: z.ZodType, value?: unknown) => {
        if (!schema) return value;
        try {
          return await schema.parseAsync(value);
        } catch (err) {
          if (
            this.configService.getInferred('app.env') !== Env.PROD &&
            err instanceof z.ZodError
          ) {
            throw new BadRequestException(err);
          }

          throw new BadRequestException();
        }
      };

      const parsed = await Promise.all([
        parse(schema.body, req.body),
        parse(schema.query, req.query),
        parse(schema.params, req.params),
      ]);
      req.parsedArgs = mergeRecords(parsed);
    };

    return from(validate()).pipe(switchMap(() => next.handle()));
  }
}
