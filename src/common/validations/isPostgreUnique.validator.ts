import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsPostgreUniqueConstraint } from './isPostgreUniqueConstraint.validator';

export type IsPostgreUniqueConstraintInput = {
  tableName: string;
  column: string;
  message?: string;
  isUpdate?: boolean;
};

export function IsPostgreUnique(
  // options: IsPostgreUniqueConstraintInput,
  options: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPostgreUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: options,
      validator: IsPostgreUniqueConstraint,
    });
  };
}
