import { Injectable } from '@nestjs/common';
import {
  ContentSecurityPolicy,
  type ContentSecurityPolicyContributor,
  type SecurityCspContribution,
} from '@forsetius/glitnir-security';

@ContentSecurityPolicy()
@Injectable()
export class CmsContentSecurityPolicyContributor implements ContentSecurityPolicyContributor {
  public getSecurityCspContribution(): SecurityCspContribution {
    return {
      connectSrc: ['https://cdn.jsdelivr.net'],
      scriptSrc: ['https://cdn.jsdelivr.net', 'https://unpkg.com'],
      styleSrc: ['https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
      fontSrc: ['https://cdn.jsdelivr.net', 'https://fonts.gstatic.com'],
    };
  }
}
