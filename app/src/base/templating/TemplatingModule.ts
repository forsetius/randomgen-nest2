import { DynamicModule, Global, Module } from '@nestjs/common';
import { TemplatingService } from './TemplatingService';
import { TEMPLATING_OPTIONS } from './TemplatingConstants';
import { TemplatingModuleOptions } from './types/TemplatingModuleOptions';

@Global()
@Module({})
export class TemplatingModule {
  static forRoot(options: TemplatingModuleOptions): DynamicModule {
    return {
      module: TemplatingModule,
      providers: [
        {
          provide: TEMPLATING_OPTIONS,
          useValue: options,
        },
        TemplatingService,
      ],
      exports: [TemplatingService],
    };
  }
}
