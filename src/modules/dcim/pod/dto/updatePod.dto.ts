import { BaseDto } from '@base/base.dto';
import { Expose } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { IsPostgreUnique } from '../../../../common/validations/isPostgreUnique.validator';

export class UpdatePodDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @Allow()
  context?: {
    params: any;
  };
  @IsPostgreUnique([
    {
      tableName: 'pods',
      column: 'name',
      message: 'Pod is already exist!',
      isUpdate: true,
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
    message: 'Region name must be no longer than or equal to 100 characters',
  })
  region_name: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Site name must be no longer than or equal to 100 characters',
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
