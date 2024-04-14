import { IsArray } from 'class-validator';

export class DeleteMultipleZoneSiteDto {
  @IsArray({
    message: 'Data must be an array',
  })
  zone_site_ids: string[];
}
