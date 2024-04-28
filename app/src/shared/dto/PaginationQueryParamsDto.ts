import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryParamsDto {
  @ApiProperty({
    required: false,
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(0)
  page: number = 0;

  @ApiProperty({ required: false, maximum: 100, minimum: 1, default: 20 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Max(100)
  @Min(1)
  itemsPerPage: number = 20;
}
