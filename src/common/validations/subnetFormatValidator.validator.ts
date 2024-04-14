import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

interface Range {
  min: number;
  max: number;
}

interface SubnetFormatConstraints {
  ranges: Range[];
}

@ValidatorConstraint({ name: 'subnetFormat', async: false })
export class SubnetFormatValidator implements ValidatorConstraintInterface {
  validate(subnet: string, args: ValidationArguments) {
    if (typeof subnet === 'string') {
      const { ranges } = args.constraints[0] as SubnetFormatConstraints;

      const subnetParts = subnet.split('/');
      if (subnetParts.length !== 2) {
        return false;
      }

      const [ipRange] = subnetParts[0].split('.').map((part) => parseInt(part));
      const mask = parseInt(subnetParts[1]);

      if (
        isNaN(ipRange) ||
        isNaN(mask) ||
        ipRange < 0 ||
        mask < 0 ||
        mask > 30
      ) {
        return false;
      }

      for (let i = 0; i < ranges.length; i++) {
        const { min, max } = ranges[i];
        if (ipRange < min || ipRange > max) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be in the specified subnet format`;
  }
}
