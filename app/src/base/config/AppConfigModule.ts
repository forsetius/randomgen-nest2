import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '../../config';
import { AppConfigService } from './AppConfigService';
import { InvalidEnvVarsException } from './exceptions/InvalidEnvVarsException';
import { EnvVarSchema, type EnvVarSchemaType } from './EnvVarSchema';
import z from 'zod';

let validatedEnvVars: EnvVarSchemaType | undefined;

function validateEnvVars(envVars: Record<string, unknown>) {
  try {
    validatedEnvVars = EnvVarSchema.parse(envVars);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new InvalidEnvVarsException(error);
    }

    throw new Error('Unknown error during environment variables validation');
  }

  return validatedEnvVars;
}

const configuration = () => {
  if (typeof validatedEnvVars === 'undefined') {
    throw new Error();
  }

  return config(validatedEnvVars);
};

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvVars,
      load: [configuration],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
