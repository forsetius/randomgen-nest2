import { Global, Module } from '@nestjs/common';
import { ConfigModule, type ConfigFactory } from '@nestjs/config';
import z from 'zod';
import { AppConfigService } from './AppConfigService';
import { InvalidEnvVarsException } from './exceptions/InvalidEnvVarsException';
import { EnvVarSchema, type EnvVarSchemaType } from './EnvVarSchema';
import { moduleConfigLoaders } from './moduleConfigLoaders';

let parsedEnvVars: EnvVarSchemaType | undefined;

function validateEnvVars(envVars: Record<string, unknown>) {
  try {
    parsedEnvVars = EnvVarSchema.parse(envVars);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new InvalidEnvVarsException(error);
    }

    throw new Error('Unknown error during environment variables validation');
  }

  return parsedEnvVars;
}

function getConfigs(): ConfigFactory[] {
  if (typeof parsedEnvVars === 'undefined') {
    throw new Error();
  }

  return moduleConfigLoaders.map((configFactory) =>
    configFactory(parsedEnvVars!),
  ) as ConfigFactory[];
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvVars,
      load: getConfigs(),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}

export type EnvAwareConfigFactory = (
  envVars: EnvVarSchemaType,
) => ConfigFactory & { KEY: string | symbol };
