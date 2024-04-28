import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '../config/AppConfigService';

@Injectable()
export class ApiDocService {
  public constructor(private configService: AppConfigService) {}

  public setup(app: INestApplication) {
    const appConfig = this.configService.getInferred('app');
    const apiDocument = new DocumentBuilder()
      .setTitle(appConfig.title)
      .setDescription(appConfig.description)
      .setVersion(appConfig.version);

    if (appConfig.host) {
      apiDocument.addServer(`${appConfig.host}:${appConfig.port}`);
    }

    const document = SwaggerModule.createDocument(app, apiDocument.build());
    const endpoint = this.configService.getInferred('docs').endpoint;

    SwaggerModule.setup(endpoint, app, document);
  }
}
