import { BaseDto } from '@base/base.dto';
import { IsUnique } from '@common/validations/isUnique.validator';
import { Expose } from 'class-transformer';
import { Allow, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateRoleDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @Allow()
  context?: {
    params: any;
  };
  @IsUnique({
    tableName: 'roles',
    column: 'name',
    message: 'Role is already exist!',
    isUpdate: true,
  })
  @MaxLength(100, {
    message: 'Name must be longer than or equal to 100 characters',
  })
  name: string;
}
