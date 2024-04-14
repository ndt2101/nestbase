import { IsArray } from 'class-validator';

export class DeleteMultipleZoneAtttDto {
  @IsArray({
    message: 'Data must be an array',
  })
  zone_attt_ids: string[];
}
