import { BaseDto } from '@base/base.dto';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ImportLocationToPodDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Name must be fewer than or equal to 100 characters',
  })
  location_name: string;
}
