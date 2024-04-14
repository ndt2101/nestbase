import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'rangeIPFormat', async: false })
export class RangeIPFormatValidator implements ValidatorConstraintInterface {
    validate(rangeIP: string, args: ValidationArguments) {
        const rangeIPRegex = /^\/([0-9]|[1-2]\d|3[0-2])$/; // Matches /0-32
        return rangeIPRegex.test(rangeIP);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be in the format /0-32`;
    }
}
