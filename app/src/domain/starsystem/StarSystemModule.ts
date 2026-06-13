import { Module } from '@nestjs/common';
import { StarSystemController } from './StarSystemController';
import { StarSystemGenerator } from './generator/StarSystemGenerator';
import { StarFactory } from './generator/StarFactory';
import { StarHierarchyGenerator } from './generator/StarHierarchyGenerator';

@Module({
  providers: [StarFactory, StarHierarchyGenerator, StarSystemGenerator],
  controllers: [StarSystemController],
})
export class StarSystemModule {}
