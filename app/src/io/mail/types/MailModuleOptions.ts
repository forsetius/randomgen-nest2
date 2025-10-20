import { MailProvider } from './MailProvider';

export interface MailModuleOptions {
  provider: MailProvider;
  credentials: {
    smtp?: {
      host: string;
      port: number;
      user: string;
      pass: string;
    };
  };
  sender: {
    name: string;
    address: string;
  };
  adminEmail: string;
}
