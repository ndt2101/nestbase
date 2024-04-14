import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateZoneSiteDto {
  @Expose()
  @IsNotEmpty()
  @IsPostgreUnique([
    {
      tableName: 'zone_site',
      column: 'name',
      message: 'Name is already exist!',
    },
  ])
  @MaxLength(100, {
    message: 'Name must be less than or equal to 100 characters',
  })
  name: string;

  @Expose()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Description must be less than or equal to 1000 characters',
  })
  description: string;
}
