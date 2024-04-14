import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsIpType(validatorOptions?: ValidationOptions){
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isIpType',
            target: object.constructor,
            propertyName: propertyName,
            options: validatorOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const validIpTypes = ['intranet', 'dcn', 'ipbn', 'mpbn'];
                    return validIpTypes.includes(value);
                },
                defaultMessage(args: ValidationArguments){
                    return `${args.property} must be one of: intranet, dcn, ipbn, mpbn`;
                }
            }
        })
    }
}