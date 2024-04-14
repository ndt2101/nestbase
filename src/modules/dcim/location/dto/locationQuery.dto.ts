import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class LocationQueryDto {
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

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  site_id?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pod_id?: number;
}
