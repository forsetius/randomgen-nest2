import { DiscoveryService } from '@nestjs/core';
import { SceneSetPattern } from '@domain/scengen/ScenGenConstants';
import { Injectable } from '@nestjs/common';
import { BaseSceneSetPattern } from '@domain/scengen/generators/sceneSets/BaseSceneSetPattern';

@Injectable()
export class SceneFactory {
  private readonly sceneSetPatterns = new Map<string, BaseSceneSetPattern>();

  /**
   * Creates a scene factory.
   *
   * Providers tagged with `@SceneSetPattern` are discovered and added to the scene set patterns map.
   */
  public constructor(private readonly discoveryService: DiscoveryService) {
    const scenarioPatterns = this.discoveryService
      .getProviders()
      .filter(
        (provider) =>
          typeof this.discoveryService.getMetadataByDecorator(
            SceneSetPattern,
            provider,
          ) === 'string',
      );

    this.sceneSetPatterns = new Map(
      scenarioPatterns.map((scenarioPattern) => [
        scenarioPattern.name as string,
        scenarioPattern.instance as BaseSceneSetPattern,
      ]),
    );
  }

  public getSceneSet(name: string): BaseSceneSetPattern {
    if (!this.sceneSetPatterns.has(name)) {
      throw new Error(`No such scene set pattern: "${name}"`);
    }

    return this.sceneSetPatterns.get(name)!;
  }
}
