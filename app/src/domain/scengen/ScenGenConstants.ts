import { DiscoveryService } from '@nestjs/core';

export const ScenarioPattern = DiscoveryService.createDecorator<string>();
