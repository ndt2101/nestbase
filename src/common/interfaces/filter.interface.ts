import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SORT_DIRECTION } from '@common/constants/global.const';

export class Pagination {
  @ApiProperty()
  @IsNotEmpty()
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  pageSize: number;
}
export class BaseFilterDto extends Pagination {
  @ApiProperty({ required: false })
  searchText: string;
}

export class BaseFilterListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  searchText: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sortBy: string;

  @ApiProperty({ required: false, type: 'enum', enum: SORT_DIRECTION })
  @IsOptional()
  @IsEnum(SORT_DIRECTION)
  sortDirection: string;
}
