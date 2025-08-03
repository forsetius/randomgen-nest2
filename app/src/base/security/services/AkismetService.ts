import { Injectable } from '@nestjs/common';
import { AkismetClient } from 'akismet-api';
import { AppConfigService } from '@config/AppConfigService';
import { Lang } from '@shared/types/Lang';
import type { Request } from 'express';

@Injectable()
export class AkismetService {
  private client: AkismetClient;

  constructor(configService: AppConfigService) {
    this.client = new AkismetClient({
      key: configService.getInferred('security.akismet.key'),
      blog: configService.getInferred('security.akismet.siteUrl'),
      lang: Object.values(Lang).join(', '),
    });
  }

  async isSpam(
    req: Request,
    type: string,
    messageData: {
      author: string;
      email: string;
      content: string;
    },
  ): Promise<boolean> {
    const valid = await this.client.verifyKey();
    if (!valid) {
      throw new Error('Invalid Akismet key');
    }

    const input = {
      user_ip: req.ip ?? '127.0.0.1',
      user_agent: req.headers['user-agent'] ?? '',
      referrer: req.headers.referer ?? '',
      comment_type: type,
      comment_author: messageData.author,
      comment_author_email: messageData.email,
      comment_content: messageData.content,
    };

    return await this.client.checkSpam(input);
  }
}
