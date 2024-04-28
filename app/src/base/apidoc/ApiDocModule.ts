import { Module } from '@nestjs/common';
import { ApiDocService } from './ApiDocService';

@Module({
  providers: [ApiDocService],
})
export class ApiDocModule {}
