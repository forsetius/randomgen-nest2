import { CmsMdModule } from '@forsetius/glitnir-cms-md';
import { MailModule } from '@forsetius/glitnir-mail';
import {
  AkismetInterceptor,
  SpamCheckModule,
} from '@forsetius/glitnir-spamcheck';
import { Module } from '@nestjs/common';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common';
import { CmsMdAdminModule } from '@forsetius/glitnir-cms-md-admin';
import { CmsContactController } from './CmsContactController';
import { CmsContentSecurityPolicyContributor } from './CmsContentSecurityPolicyContributor';
import { ContactSpamCheckInterceptor } from './interceptors/ContactSpamCheckInterceptor';
import { LegacyCmsRedirectMiddleware } from './middleware/LegacyCmsRedirectMiddleware';

@Module({
  imports: [
    CmsMdModule.forRoot({ apiPrefix: '/pages', publicRoutes: true }),
    CmsMdAdminModule.forRoot({ path: '/cms-admin' }),
    SpamCheckModule,
    MailModule,
  ],
  controllers: [CmsContactController],
  providers: [
    AkismetInterceptor,
    ContactSpamCheckInterceptor,
    CmsContentSecurityPolicyContributor,
    LegacyCmsRedirectMiddleware,
  ],
})
export class CmsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LegacyCmsRedirectMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
