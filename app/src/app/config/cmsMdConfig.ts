import path from 'node:path';
import type { CmsMdConfig } from '@forsetius/glitnir-cms-md';
import type { AppConfigSource } from './AppConfigSource';
import { normalizeAppOrigin } from './AppConfigContracts';

interface CmsMdConfigOverrides {
  readonly appOrigin: CmsMdConfig['appOrigin'];
  readonly brand: CmsMdConfig['brand'];
  readonly paths: CmsMdConfig['paths'];
  readonly templates: Pick<
    CmsMdConfig['templates'],
    'fragmentCard' | 'fragmentListItem'
  >;
}

export function resolveCmsMdConfig(
  source: Readonly<AppConfigSource>,
): CmsMdConfigOverrides {
  return {
    appOrigin: normalizeAppOrigin(source.APP_HOST),
    brand: {
      name: 'Forseti: Abstract Works',
      copyright: '© 2025 by Marcin "Forseti" Paździora',
      logo: 'logo-w.png',
    },
    paths: {
      sourceDir: path.join(source.CMS_SOURCE_DIR, 'sources'),
      outputDir: path.join(source.CMS_SOURCE_DIR, 'static', 'pages'),
      mediaDir: path.join(source.CMS_SOURCE_DIR, 'static', 'media'),
      uiDir: path.join(source.CMS_SOURCE_DIR, 'static', 'ui'),
    },
    templates: {
      fragmentCard: 'fragment-img-card',
      fragmentListItem: 'fragment-list-item',
    },
  };
}
