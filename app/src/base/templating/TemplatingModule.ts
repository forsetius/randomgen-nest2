import { Global, Module } from '@nestjs/common';
import { TemplatingService } from './TemplatingService';

@Global()
@Module({
  providers: [TemplatingService],
  exports: [TemplatingService],
})
export class TemplatingModule {}
