import { BaseDto } from '@base/base.dto';
import { IsArray } from 'class-validator';

export class RackToPodDto extends BaseDto {
  @IsArray({
    message: 'Rack must be an array',
  })
  rack_ids: string[];
}
