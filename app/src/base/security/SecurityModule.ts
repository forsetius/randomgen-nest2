import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { SecurityService } from './services/SecurityService';
import { AppConfigService } from '@config/AppConfigService';
import { ContentSecurityPolicyRegistry } from './ContentSecurityPolicyRegistry';
import { AkismetService } from './services/AkismetService';
import { AkismetInterceptor } from './interceptors/AkismetInterceptor';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const securityConfig = configService.getInferred('security');

        return [
          {
            limit: securityConfig.rateLimit.limit,
            ttl: securityConfig.rateLimit.windowMs,
          },
        ];
      },
    }),
  ],
  providers: [
    AkismetService,
    AkismetInterceptor,
    ContentSecurityPolicyRegistry,
    SecurityService,
  ],
  exports: [AkismetService, ContentSecurityPolicyRegistry],
})
export class SecurityModule {}
