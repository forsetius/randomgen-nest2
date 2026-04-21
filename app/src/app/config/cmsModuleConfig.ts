import path from 'path';
import { CmsModuleOptions } from '../../base/cms/types/CmsModuleOptions';
import type { Lang } from '@shared/types/Lang';
import type { AppConfigSource } from './AppConfigSource';
import { normalizeAppOrigin } from './AppConfigContracts';

export function resolveCmsModuleConfig(
  source: Readonly<AppConfigSource>,
): CmsModuleOptions {
  return {
    appOrigin: normalizeAppOrigin(source.APP_HOST),
    supportedLangs: ['en', 'pl'] satisfies Lang[],
    fragmentTemplates: ['fragment-img-card', 'fragment-list-item'],
    paths: {
      sourceDir: path.join(source.CMS_SOURCE_DIR, 'sources'),
      outputDir: path.join(source.CMS_SOURCE_DIR, 'static', 'pages'),
      mediaDir: path.join(source.CMS_SOURCE_DIR, 'static', 'media'),
      uiDir: path.join(source.CMS_SOURCE_DIR, 'static', 'ui'),
    },
    defaults: {
      headerImage: 'index-head.jpg',
    },
    brand: {
      name: 'Forseti: Abstract Works',
      copyright: '© 2025 by Marcin "Forseti" Paździora',
      logo: 'logo-w.png',
    },
    contact: {
      recipient: {
        address: 'forseti@forseti.pl',
      },
    },
  };
}
