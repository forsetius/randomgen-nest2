import { Global, Module } from '@nestjs/common';
import { ConfigModule, type ConfigFactory } from '@nestjs/config';
import z from 'zod';
import { AppConfigService } from './AppConfigService';
import { InvalidEnvVarsException } from './exceptions/InvalidEnvVarsException';
import { EnvVarSchema, type EnvVarSchemaType } from './EnvVarSchema';
import { moduleConfigLoaders } from './moduleConfigLoaders';
import { loadEnvFile } from '@shared/util/loadEnvFile';

let cachedEnvVars: EnvVarSchemaType | undefined = undefined;

function getConfigs(): ConfigFactory[] {
  if (typeof cachedEnvVars === 'undefined') {
    loadEnvFile();

    try {
      cachedEnvVars = EnvVarSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new InvalidEnvVarsException(error);
      }
      if (error instanceof Error) {
        throw new Error(
          'An error during environment variables validation: \n' +
            error.toString(),
        );
      }

      throw new Error('Unknown error during environment variables validation');
    }
  }

  return moduleConfigLoaders.map((configFactory) =>
    configFactory(cachedEnvVars!),
  ) as ConfigFactory[];
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: getConfigs(),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
