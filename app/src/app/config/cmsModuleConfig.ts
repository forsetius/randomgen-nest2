import path from 'path';
import { CmsModuleOptions } from '../../base/cms/types/CmsModuleOptions';
import { EnvVarSchemaType } from '@config/EnvVarSchema';
import { registerAsTyped } from '@config/registerAsTyped';
import { Lang } from '@shared/types/Lang';

const appRoot = path.join(__dirname, '..', '..', '..');

export default (envVars: EnvVarSchemaType) =>
  registerAsTyped(
    'cms',
    () =>
      ({
        appOrigin: envVars.APP_HOST,
        supportedLangs: [Lang.EN, Lang.PL],
        fragmentTemplates: ['fragment-img-card', 'fragment-list-item'],
        paths: {
          mediaDir: path.join(appRoot, 'content', 'cms', 'static', 'media'),
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
