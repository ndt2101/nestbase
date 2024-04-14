import { IsArray } from 'class-validator';

export class DeleteMultipleInfrastrucutreDto {
  @IsArray({
    message: 'Data must be an array',
  })
  infrastructure_ids: string[];
}
