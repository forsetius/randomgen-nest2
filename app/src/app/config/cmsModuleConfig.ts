import path from 'path';
import { CmsModuleOptions } from '../../base/cms/types/CmsModuleOptions';
import { EnvVarSchemaType } from '@config/EnvVarSchema';
import { registerAsTyped } from '@config/registerAsTyped';

const appRoot = path.join(__dirname, '..', '..', '..', '..');

export default (envVars: EnvVarSchemaType) =>
  registerAsTyped(
    'cms',
    () =>
      ({
        appHost: envVars.APP_HOST,
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
