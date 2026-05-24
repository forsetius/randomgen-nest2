export interface CmsLegacyRedirectOptions {
  readonly sourcePathPrefix: string;
  readonly targetOrigin: string;
  readonly statusCode: 301 | 302;
}

export interface CmsModuleOptions {
  readonly contact: {
    readonly recipient: {
      readonly address: string;
      readonly name?: string;
    };
  };
  readonly legacyRedirects: CmsLegacyRedirectOptions[];
}
