import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsOptional,
  Allow,
} from 'class-validator';

export class UpdateZoneDto {
  @Expose()
  @IsNotEmpty()
  @Allow()
  context?: {
    params: any;
  };
  @IsPostgreUnique([
    {
      tableName: 'zone',
      column: 'name',
      message: 'Zone name is already exist!',
      isUpdate: true,
    },
  ])
  @MaxLength(100, {
    message: 'Zone name must be less than or equal to 100 characters',
  })
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  infrastructure_type_id: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  zone_attt_id: number;

  @Expose()
  @IsOptional()
  description: string;
}
