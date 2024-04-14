import { BaseDto } from '@base/base.dto';
import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreatePodDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsPostgreUnique([
    {
      tableName: 'pods',
      column: 'name',
      message: 'Pod is already exist!',
    },
  ])
  @MaxLength(100, {
    message: 'Name must be longer than or equal to 100 characters',
  })
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  infrastructure_type_id: number;

  @Expose()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Region name must be less than or equal to 100 characters',
  })
  region_name: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Site name must be less than or equal to 100 characters',
  })
  site_name: string;

  @IsArray({
    message: 'Location must be an array',
  })
  @IsOptional()
  locations: string[];

  @IsArray({
    message: 'Racks must be an array',
  })
  @IsOptional()
  racks: string[];
}
