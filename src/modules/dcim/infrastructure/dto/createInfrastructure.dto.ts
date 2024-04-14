import { BaseDto } from '@base/base.dto';
import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateInfrastructureDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsPostgreUnique([
    {
      tableName: 'infrastructures',
      column: 'name',
      message: 'Infrastructure is already exist!',
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
  @IsInt()
  pod_id: number;
}
