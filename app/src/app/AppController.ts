import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { AppService } from './services/AppService';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  redirectRoot(@Res() response: Response): void {
    response.redirect(302, '/pages/pl/index.html');
  }

  @Get('/en')
  redirectEnglishRoot(@Res() response: Response): void {
    response.redirect(302, '/pages/en/index.html');
  }

  @Get('/pl')
  redirectPolishRoot(@Res() response: Response): void {
    response.redirect(302, '/pages/pl/index.html');
  }

  @ApiOperation({ description: 'Hello World' })
  @ApiOkResponse()
  @Get(`/ping`)
  getHello(): string {
    return this.appService.getHello();
  }
}
