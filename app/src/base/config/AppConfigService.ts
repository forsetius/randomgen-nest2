import { ConfigService, Path, PathValue } from '@nestjs/config';
import type { moduleConfigLoaders } from './moduleConfigLoaders';

type ModuleConfigLoadersTuple = typeof moduleConfigLoaders;
type ModuleConfigs = {
  [Loader in ModuleConfigLoadersTuple[number] as ReturnType<Loader>['KEY'] extends
    | string
    | symbol
    ? ReturnType<Loader>['KEY']
    : never]: Awaited<ReturnType<ReturnType<Loader>>>;
};

type WasValidated = true;

export class AppConfigService extends ConfigService<
  ModuleConfigs,
  WasValidated
> {
  override get<P extends Path<ModuleConfigs>>(
    propertyPath: P,
  ): PathValue<ModuleConfigs, P> {
    return super.get(propertyPath, { infer: true });
  }
}
