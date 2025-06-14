import { Attachment } from 'nodemailer/lib/mailer';

export interface MailProviderData {
  from: { name: string; address: string };
  to: string | string[];
  replyTo?: string;
  subject: string;
  text: string;
  attachments?: Attachment[];
}

export interface MailProviderInterface {
  send(params: MailProviderData): Promise<void>;
}
