import compression from 'compression';
import helmet from 'helmet';
import { INestApplication, Injectable } from '@nestjs/common';

@Injectable()
export class SecurityService {
  public setup(app: INestApplication) {
    app.enableCors();
    app.use(compression());
    app.use(helmet());
  }
}
