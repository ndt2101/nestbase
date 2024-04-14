import { IsArray } from 'class-validator';

export class DeleteMultipleVlanDto {
  @IsArray({
    message: 'Data must be an array',
  })
  vlan_ids: string[];
}
