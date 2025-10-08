import { MailProviderData, MailProviderInterface } from '../types';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { AppConfigService } from '@config/AppConfigService';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class SmtpProvider implements MailProviderInterface {
  private mailTransport!: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly logger = new Logger(SmtpProvider.name);

  constructor(private readonly configService: AppConfigService) {}

  async onModuleInit(): Promise<void> {
    this.mailTransport = this.getMailTransport();

    try {
      void (await this.mailTransport.verify());
      this.logger.log('Mail transport established');
    } catch (reason: unknown) {
      this.logger.error(reason);
      throw new InternalServerErrorException(
        'SMTP transport returned configuration error',
      );
    }
  }

  public async send(mailData: MailProviderData): Promise<void> {
    try {
      await this.mailTransport.sendMail(mailData);
    } catch (e) {
      this.logger.error(e instanceof Error ? e.message : e);

      throw e;
    }
  }

  private getMailTransport(): Transporter<SMTPTransport.SentMessageInfo> {
    const config = this.configService.getInferred('mail.credentials.smtp');
    if (!config) {
      throw new InternalServerErrorException('SMTP mail is not configured');
    }

    return createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }
}
