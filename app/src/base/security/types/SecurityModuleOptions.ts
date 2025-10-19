export interface SecurityModuleOptions {
  akismet: {
    key: string;
    siteUrl: string;
  };
  rateLimit: {
    limit: number;
    windowMs: number;
  };
}
