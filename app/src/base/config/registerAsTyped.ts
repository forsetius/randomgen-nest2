import {
  registerAs,
  type ConfigFactory,
  type ConfigObject,
} from '@nestjs/config';

type RegisterAsReturn<TConfig extends ConfigObject> = ReturnType<
  typeof registerAs<TConfig, ConfigFactory<TConfig>>
>;

export function registerAsTyped<
  Token extends string | symbol,
  TConfig extends ConfigObject,
>(token: Token, configFactory: ConfigFactory<TConfig>) {
  const factory = registerAs(token, configFactory);

  return factory as RegisterAsReturn<TConfig> & { KEY: Token };
}
