import { Module } from '@nestjs/common';
import { EnglishGenerator } from './generators/EnglishGenerator';
import { PolishGenerator } from './generators/PolishGenerator';
import { TechnobabbleController } from './TechnobabbleController';

@Module({
  controllers: [TechnobabbleController],
  providers: [PolishGenerator, EnglishGenerator],
})
export class TechnobabbleModule {}
