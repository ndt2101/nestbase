import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEmptyOrInteger(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsEmptyOrInteger',
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === '' || value == null || value === undefined) {
            // allow empty value
            return true;
          }
          if (Number.isInteger(value)) {
            // Value is an integer
            return true;
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be empty or an integer`;
        },
      },
    });
  };
}
