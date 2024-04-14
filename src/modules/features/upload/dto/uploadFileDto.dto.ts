import { Expose } from 'class-transformer';
import { MaxLength, IsOptional, IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @Expose()
  @IsOptional()
  // @MaxLength(1000, {
  //   message: 'Folder name must be less than or equal to 1000 characters',
  // })
  folder_name?: string;

  @Expose()
  @IsNotEmpty()
  // @MaxLength(1000, {
  //   message: 'Entity type must be less than or equal to 1000 characters',
  // })
  entity_type?: string;

  @Expose()
  @IsNotEmpty()
  entity_id: number;
}