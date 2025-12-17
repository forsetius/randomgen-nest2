import { Module } from '@nestjs/common';
import { ScenGenController } from '@domain/scengen/ScenGenController';
import { ScenGenService } from '@domain/scengen/services/ScenGenService';
import { DiscoveryModule } from '@nestjs/core';
import { ConflictOfInterestsPattern } from './services/generators/ConflictOfInterestsPattern';
import { ParserModule } from '../../base/parser/ParserModule';
import { SettingFactory } from '@domain/scengen/services/SettingFactory';

@Module({
  imports: [DiscoveryModule, ParserModule],
  controllers: [ScenGenController],
  providers: [ScenGenService, SettingFactory, ConflictOfInterestsPattern],
})
export class ScenGenModule {}
