import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export const SortDto = <SortBy extends Record<string, string>>(
  sortBy: SortBy,
) => {
  class InternalSortDto {
    @ApiProperty({ enum: SortDirection })
    @IsEnum(SortDirection)
    @IsOptional()
    public sortDirection: SortDirection = SortDirection.asc;

    @ApiProperty({ enum: sortBy })
    @IsEnum(sortBy)
    @IsOptional()
    public sortBy?: keyof SortBy;
  }

  return InternalSortDto;
};
