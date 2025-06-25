import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './services/AppService';
import { AppConfigModule } from '@config/AppConfigModule';
import { SecurityModule } from '../base/security/SecurityModule';
import { TemplatingModule } from '@templating/TemplatingModule';
import { TechnobabbleModule } from '@domain/technobabble/TechnobabbleModule';
import { CmsModule } from '../base/cms/CmsModule';
import { ParserModule } from '../base/parser/ParserModule';
import { MailModule } from '../io/mail';

const appRoot = path.join(__dirname, '..', '..');

@Module({
  imports: [
    AppConfigModule,
    SecurityModule,
    TemplatingModule.forRoot({
      paths: path.join(appRoot, 'content', 'cms', 'templates'),
      options: {
        autoescape: false,
        throwOnUndefined: true,
      },
    }),
    MailModule,
    CmsModule.forRoot({
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
    }),
    TechnobabbleModule,
    ParserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
