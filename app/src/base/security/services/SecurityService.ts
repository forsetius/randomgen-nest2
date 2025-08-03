import compression from 'compression';
import helmet from 'helmet';
import { INestApplication, Injectable } from '@nestjs/common';
import { ContentSecurityPolicyRegistry } from '../ContentSecurityPolicyRegistry';

@Injectable()
export class SecurityService {
  private appRef?: INestApplication;

  constructor(private readonly cspRegistry: ContentSecurityPolicyRegistry) {}

  public setup(app: INestApplication) {
    this.appRef = app;

    app.enableCors();
    app.use(compression());
  }

  onApplicationBootstrap() {
    const cspDirectives = this.cspRegistry.getPolicyDirectives();
    this.appRef!.use(
      helmet({
        contentSecurityPolicy: {
          directives: cspDirectives,
        },
      }),
    );
  }
}
