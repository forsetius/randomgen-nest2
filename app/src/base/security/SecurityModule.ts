import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { SecurityService } from './SecurityService';
import { AppConfigService } from '../config/AppConfigService';

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
  providers: [SecurityService],
})
export class SecurityModule {}
