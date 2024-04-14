import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class InfrastructureQueryDto {
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
  pod_ids?: string;

  @IsString()
  @IsOptional()
  site_names?: string;

  @IsString()
  @IsOptional()
  region_names?: string;

  @IsString()
  @IsOptional()
  infrastructure_type_ids?: string;
}
