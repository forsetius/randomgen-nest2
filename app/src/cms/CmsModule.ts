import { CmsMdModule } from '@forsetius/glitnir-cms-md';
import { MailModule } from '@forsetius/glitnir-mail';
import {
  AkismetInterceptor,
  SpamCheckModule,
} from '@forsetius/glitnir-spamcheck';
import { Module } from '@nestjs/common';
import { CmsContactController } from './CmsContactController';
import { CmsContentSecurityPolicyContributor } from './CmsContentSecurityPolicyContributor';
import { ContactSpamCheckInterceptor } from './interceptors/ContactSpamCheckInterceptor';

@Module({
  imports: [CmsMdModule.forRoot('/'), SpamCheckModule, MailModule],
  controllers: [CmsContactController],
  providers: [
    AkismetInterceptor,
    ContactSpamCheckInterceptor,
    CmsContentSecurityPolicyContributor,
  ],
})
export class CmsModule {}
