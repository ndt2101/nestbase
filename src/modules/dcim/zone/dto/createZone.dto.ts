import { IsEmptyOrInteger } from '@common/validations/isEmptyOrInteger.validator';
import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { Expose } from 'class-transformer';
import { IsNotEmpty, MaxLength, IsInt, IsOptional } from 'class-validator';

export class CreateZoneDto {
  @Expose()
  @IsNotEmpty()
  @IsPostgreUnique([
    {
      tableName: 'zone',
      column: 'name',
      message: 'Zone name is already exist!',
    },
  ])
  @MaxLength(100, {
    message: 'Zone name must be less than or equal to 100 characters',
  })
  name: string;

  @Expose()
  @IsEmptyOrInteger()
  @IsPostgreUnique([
    {
      tableName: 'zone',
      column: 'zone_id',
      message: 'Zone id is already exist in this infrastructure!',
    },
    {
      tableName: 'zone',
      column: 'infrastructure_type_id',
    },
  ])
  zone_id: number;

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
