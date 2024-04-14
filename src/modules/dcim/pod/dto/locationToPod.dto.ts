import { BaseDto } from '@base/base.dto';
import { IsArray } from 'class-validator';

export class LocationToPodDto extends BaseDto {
  @IsArray({
    message: 'Location must be an array',
  })
  location_ids: string[];
}
