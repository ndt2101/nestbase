import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsUniqueConstraint } from './isUniqueConstraint.validator';

export type IsUniqueConstraintInput = {
  tableName: string;
  column: string;
  message?: string;
  isUpdate?: boolean;
};

export function IsUnique(
  // options: IsUniqueConstraintInput,
  options: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}