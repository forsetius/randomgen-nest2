import { BadRequestException, Injectable } from '@nestjs/common';
import type { ScenGenGenerateRequestDto } from '@domain/scengen/validation/ScenGenGenerateRequestSchema';
import { DiscoveryService } from '@nestjs/core';
import { ScenarioPattern } from '@domain/scengen/ScenGenConstants';
import { Setting } from '@domain/scengen/domain/Setting';
import { AppConfigService } from '@config/AppConfigService';
import { SettingFactory } from '@domain/scengen/services/SettingFactory';
import { LoaderService } from '../../../base/parser/services/LoaderService';
import { BasePattern } from '@domain/scengen/services/generators/BasePattern';
import { Requirements } from '@domain/scengen/types/Requirements';
import { throwOnUndefined } from '@shared/util/isType';
import path from 'path';
import { SourceDataZodSchema } from '@domain/scengen/validation/SourceDataZodSchema';

@Injectable()
export class ScenGenService {
  private readonly scenarioPatterns = new Map<string, BasePattern>();
  private readonly settings = new Map<string, Setting>();

  public constructor(
    private readonly configService: AppConfigService,
    private readonly discoveryService: DiscoveryService,
    private readonly loaderService: LoaderService,
    private readonly settingFactory: SettingFactory,
  ) {
    const scenarioPatterns = this.discoveryService
      .getProviders()
      .filter(
        (provider) =>
          typeof this.discoveryService.getMetadataByDecorator(
            ScenarioPattern,
            provider,
          ) === 'string',
      );

    this.scenarioPatterns = new Map(
      scenarioPatterns.map((scenarioPattern) => [
        scenarioPattern.name as string,
        scenarioPattern.instance as BasePattern,
      ]),
    );
  }

  async onModuleInit(): Promise<void> {
    await this.loadSettings(this.configService.get('scengen.sourceDir'));
  }

  private async loadSettings(sourceDir: string): Promise<void> {
    const settingDirs = this.loaderService.getDirectoryList(sourceDir, false);
    for (const settingDir of settingDirs) {
      const dir = path.join(sourceDir, settingDir);
      const setting = await this.settingFactory.createFromDirectory(
        dir,
        SourceDataZodSchema,
      );
      console.log({ dir, setting });
      this.settings.set(setting.name, setting);
    }
  }

  // FIXME
  public generate(dto: ScenGenGenerateRequestDto): void {
    // FIXME return type
    const scenarioPattern = throwOnUndefined(
      this.scenarioPatterns.get(dto.scenarioPattern),
      new BadRequestException(`No such pattern: ${dto.scenarioPattern}`),
    );

    const setting = throwOnUndefined(
      this.settings.get(dto.setting),
      new BadRequestException(`No such setting: "${dto.setting}"`),
    );
    console.log(setting);
    const location = dto.location
      ? setting.locations.get(
          throwOnUndefined(
            dto.location,
            new BadRequestException(`No such location: "${dto.location}"`),
          ),
        )
      : undefined;
    const requirements: Requirements = { location }; // FIXME

    scenarioPattern.generate(setting, requirements);
  }
}
