import { BaseDto } from '@base/base.dto';
import {
  Validate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { IsPostgreUnique } from '@common/validations/isPostgreUnique.validator';
import { SubnetFormatValidator } from '@common/validations/subnetFormatValidator.validator';
import { IsIpType } from '@common/validations/isIpType.validator';
import { Expose } from 'class-transformer';
import { RangeIPFormatValidator } from '@common/validations/rangeIPFormatValidator.validator';

export class CreateVlanDto {
  @Expose()
  @IsNotEmpty()
  @IsPostgreUnique([
    {
      tableName: 'vlan',
      column: 'vlan_name',
      message: 'Vlan name is already exist!',
    },
    {
      tableName: 'vlan',
      column: 'zone_site_id',
    },
  ])
  vlan_name: string;

  @IsNotEmpty()
  @IsNumber()
  vlan_id: number;

  @IsNotEmpty()
  @IsNumber()
  zone_site_id: number;

  @IsNotEmpty()
  @IsNumber()
  zone_uu_id: number;

  @IsOptional()
  @IsNumber()
  infrastructure_type_id: number;

  @IsOptional()
  @IsString()
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
    },
  ])
  subnet: string;

  @IsOptional()
  @IsString()
  vlan_id_l3: string;

  @IsOptional()
  @IsString()
  vxlan_id: string;

  @IsOptional()
  @IsString()
  vxlan_id_l3: string;

  @IsOptional()
  @IsString()
  gw: string;

  @IsOptional()
  @IsString()
  vrf: string;

  @IsOptional()
  @IsArray()
  loadbalancer_ids: number[];

  @IsOptional()
  @IsArray()
  firewall_ids: number[];

  @IsOptional()
  @IsString()
  @IsIpType()
  ip_type: string;

  @IsOptional()
  @IsString()
  @Validate(RangeIPFormatValidator)
  range_ip: string;

  @IsOptional()
  @IsString()
  system: string;

  @IsOptional()
  @IsString()
  purpose: string;

  @IsOptional()
  @IsString()
  description?: string;
}
