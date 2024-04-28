import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto {
  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  itemsPerPage!: number;
}
