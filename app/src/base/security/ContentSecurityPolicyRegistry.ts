import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentSecurityPolicyRegistry {
  private scriptSrc: string[] = ["'self'"];
  private styleSrc: string[] = ["'self'"];
  private fontSrc: string[] = ["'self'"];

  registerScriptSrc(source: string) {
    if (!this.scriptSrc.includes(source)) this.scriptSrc.push(source);
  }

  registerStyleSrc(source: string) {
    if (!this.styleSrc.includes(source)) this.styleSrc.push(source);
  }

  registerFontSrc(source: string) {
    if (!this.fontSrc.includes(source)) this.fontSrc.push(source);
  }

  getPolicyDirectives() {
    return {
      defaultSrc: ["'self'"],
      scriptSrc: [...this.scriptSrc],
      styleSrc: [...this.styleSrc],
      fontSrc: [...this.fontSrc],
    };
  }
}
