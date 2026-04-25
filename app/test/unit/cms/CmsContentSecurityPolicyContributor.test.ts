import { CmsContentSecurityPolicyContributor } from '../../../src/cms/CmsContentSecurityPolicyContributor';

describe('CmsContentSecurityPolicyContributor', () => {
  test('allows required external CMS asset origins without enabling inline code', () => {
    const contributor = new CmsContentSecurityPolicyContributor();

    expect(contributor.getSecurityCspContribution()).toEqual({
      connectSrc: ['https://cdn.jsdelivr.net'],
      scriptSrc: ['https://cdn.jsdelivr.net', 'https://unpkg.com'],
      styleSrc: ['https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
      fontSrc: ['https://cdn.jsdelivr.net', 'https://fonts.gstatic.com'],
    });
  });
});
