import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class DeviceQueryDto {
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
  rack_id?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  location_id?: number;
}
