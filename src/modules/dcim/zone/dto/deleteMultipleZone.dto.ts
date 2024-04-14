import { IsArray } from 'class-validator';

export class DeleteMultipleZoneDto {
  @IsArray({
    message: 'Data must be an array',
  })
  zone_ids: string[];
}
