import path from 'node:path';
import type { CmsMdConfig } from '@forsetius/glitnir-cms-md';
import { normalizeAppOrigin } from '../../shared/util/url';
import type { ExternalConfigData } from '../ExternalConfigData';

interface CmsMdConfigOverrides {
  readonly appOrigin: CmsMdConfig['appOrigin'];
  readonly brand: CmsMdConfig['brand'];
  readonly paths: CmsMdConfig['paths'];
}

export function resolveCmsMdConfig(
  configData: Readonly<ExternalConfigData>,
): CmsMdConfigOverrides {
  return {
    appOrigin: normalizeAppOrigin(configData.APP_HOST),
    brand: {
      name: 'Forseti: abstract worlds',
      copyright: '© 2026 Marcin Paździora',
      logo: 'logo.svg',
    },
    paths: {
      sourceDir: path.join(configData.CMS_SOURCE_DIR, 'sources'),
      outputDir: path.join(configData.CMS_SOURCE_DIR, 'static', 'pages'),
      mediaDir: path.join(configData.CMS_SOURCE_DIR, 'static', 'media'),
      uiDir: path.join(configData.CMS_SOURCE_DIR, 'static', 'ui'),
    },
  };
}
