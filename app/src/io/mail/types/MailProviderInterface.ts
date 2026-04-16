import type { SendMailOptions } from 'nodemailer';

export interface MailProviderData {
  from: { name: string; address: string };
  to: string | string[];
  replyTo?: string;
  subject: string;
  text: string;
  attachments?: NonNullable<SendMailOptions['attachments']>;
}

export interface MailProviderInterface {
  send(params: MailProviderData): Promise<void>;
}
