import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class DeviceByPodQueryDto {
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
  @Type(() => Number)
  pod_id?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  site_id?: number;

  @IsString()
  @IsOptional()
  rack_ids: string;

  @IsString()
  @IsOptional()
  location_ids: string;

  @IsString()
  @IsOptional()
  device_types: string;
}
