import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ScenGenController } from '@domain/scengen/ScenGenController';
import { ParserModule } from '../../base/parser/ParserModule';
import * as Generator from '@domain/scengen/generators/scenarioPatterns';
import { PickerService } from '@domain/scengen/services/PickerService';
import { SettingService } from '@domain/scengen/services/SettingService';

@Module({
  imports: [DiscoveryModule, ParserModule],
  controllers: [ScenGenController],
  providers: [PickerService, SettingService, Generator.MissionGenerator],
})
export class ScenGenModule {}
