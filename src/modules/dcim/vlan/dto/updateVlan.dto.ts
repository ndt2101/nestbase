import { BaseDto } from '@base/base.dto';
import {
  Validate,
  IsOptional,
  IsString,
  IsArray,
  Allow,
  IsNotEmpty,
} from 'class-validator';
import { SubnetFormatValidator } from '@common/validations/subnetFormatValidator.validator';
import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { Expose } from 'class-transformer';

export class UpdateVlanDto {
  @Expose()
  @IsNotEmpty()
  @Allow()
  context?: {
    params: any;
  };
  @Validate(SubnetFormatValidator, [
    {
      ranges: [
        { min: 1, max: 255 }, // First range: 1-255
        { min: 1, max: 255 }, // Second range: 1-255
        { min: 1, max: 255 }, // Third range: 1-255
        { min: 0, max: 255 }, // Fourth range: 0-255
        { min: 0, max: 30 }, // Fifth range: 0-30
      ],
    },
  ])
  @IsPostgreUnique([
    {
      tableName: 'vlan',
      column: 'subnet',
      message: 'Subnet is already exist!',
      isUpdate: true,
    },
  ])
  subnet: string;

  @IsOptional()
  @IsArray()
  loadbalancer_ids: number[];

  @IsOptional()
  @IsArray()
  firewall_ids: number[];

  @IsOptional()
  @IsString()
  description?: string;
}
