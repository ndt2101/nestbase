import { BaseDto } from '@base/base.dto';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class VlanQueryDto extends BaseDto {
  @IsString()
  @IsOptional()
  filter?: string;

  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(1000)
  per_page?: number;

  @IsString()
  @IsOptional()
  zone_site_ids?: string;

  @IsString()
  @IsOptional()
  zone_uu_ids?: string;

  @IsString()
  @IsOptional()
  subnet?: string;

  @IsString()
  @IsOptional()
  infrastructure_type_ids?: string;
}
