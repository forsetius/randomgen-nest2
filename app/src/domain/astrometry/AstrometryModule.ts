import { Module } from '@nestjs/common';
import { AstrometryController } from './AstrometryController';
import { AstrometryService } from './AstrometryService';

@Module({
  controllers: [AstrometryController],
  providers: [AstrometryService],
})
export class AstrometryModule {}
