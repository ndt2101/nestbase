import { BaseDto } from '@base/base.dto';
import { IsUnique } from '@common/validations/isUnique.validator';
import { Expose } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRoleDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsUnique({ tableName: 'roles', column: 'name', message: 'Role is already exist!' })
  @MaxLength(100, {
    message: 'Name must be longer than or equal to 100 characters',
  })
  name: string;

  @Expose()
  @MaxLength(1000, {
    message: 'Type must be longer than or equal to 1000 characters',
  })
  description: string;
}
