import path from 'path';
import { CmsModuleOptions } from '../../base/cms/types/CmsModuleOptions';
import { EnvVarSchemaType } from '@config/EnvVarSchema';
import { registerAsTyped } from '@config/registerAsTyped';
import { Lang } from '@shared/types/Lang';

export default (envVars: EnvVarSchemaType) =>
  registerAsTyped(
    'cms',
    () =>
      ({
        appOrigin: envVars.APP_HOST,
        supportedLangs: [Lang.EN, Lang.PL],
        fragmentTemplates: ['fragment-img-card', 'fragment-list-item'],
        paths: {
          sourceDir: path.join(envVars.CMS_SOURCE_DIR, 'sources'),
          outputDir: path.join(envVars.CMS_SOURCE_DIR, 'static', 'pages'),
          mediaDir: path.join(envVars.CMS_SOURCE_DIR, 'static', 'media'),
          uiDir: path.join(envVars.CMS_SOURCE_DIR, 'static', 'ui'),
        },
        defaults: {
          headerImage: 'index-head.jpg',
        },
        brand: {
          name: 'Forseti: Abstract Works',
          copyright: '© 2025 by Marcin "Forseti" Paździora',
          logo: 'logo-w.png',
        },
      }) satisfies CmsModuleOptions,
  );
