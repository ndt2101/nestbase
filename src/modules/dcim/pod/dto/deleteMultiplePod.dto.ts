import { IsArray } from 'class-validator';

export class DeleteMultiplePodDto {
  @IsArray({
    message: 'Data must be an array',
  })
  pod_ids: string[];
}
