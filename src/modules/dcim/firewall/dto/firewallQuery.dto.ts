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

export class FirewallQueryDto {
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

}