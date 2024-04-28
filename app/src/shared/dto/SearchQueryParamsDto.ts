import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SearchQueryParamsDto {
  @ApiProperty({
    required: false,
    maxLength: 180,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(180)
  search?: string;
}
