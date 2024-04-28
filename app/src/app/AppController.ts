import { Controller, Get } from '@nestjs/common';
import { AppService } from './services/AppService';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({description: 'Hello World'})
  @ApiOkResponse()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
