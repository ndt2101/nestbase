// import { PartialType } from '@nestjs/swagger';
// import { CreateZoneSiteDto } from './createZoneSite.dto';
import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDto } from '@base/base.dto';

export class UpdateZoneSiteDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  context?: {
    params: any;
  };
  @IsPostgreUnique([
    {
      tableName: 'zone_site',
      column: 'name',
      message: 'Name is already exist!',
      isUpdate: true,
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
