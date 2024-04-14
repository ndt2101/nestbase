import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { Expose } from 'class-transformer';
import { IsNotEmpty, MaxLength, IsInt, IsOptional } from 'class-validator';

export class CreateZoneAtttDto {
  @Expose()
  @IsNotEmpty()
  @IsPostgreUnique([
    {
      tableName: 'zone_attt',
      column: 'name',
      message: 'Name is already exist!',
    },
  ])
  @MaxLength(100, {
    message: 'Name must be less than or equal to 100 characters',
  })
  name: string;

  @Expose()
  @IsNotEmpty()
  zone_group: string;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  security_level: number;

  @Expose()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Description must be less than or equal to 1000 characters',
  })
  description: string;
}
