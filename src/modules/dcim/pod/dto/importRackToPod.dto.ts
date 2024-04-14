import { BaseDto } from '@base/base.dto';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class ImportRackToPodDto extends BaseDto {
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Rack Name must be fewer than or equal to 100 characters',
  })
  rack_name: string;

  // @IsNotEmpty()
  // @MaxLength(100, {
  //   message: 'Location name must be fewer than or equal to 100 characters',
  // })
  // location_name: string;
}
