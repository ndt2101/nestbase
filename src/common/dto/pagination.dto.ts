import { Expose, Type } from 'class-transformer';
import { MetaDataDto } from './metaPagination.dto';
import { ValidateNested } from 'class-validator';

export class PaginationDto<T> {
    @Expose()
    @ValidateNested()
    @Type(() => MetaDataDto)
    meta: MetaDataDto;
  
    @Expose()
    data: T[];
  
    constructor(page: number, perPage: number, total: number, data: T[]) {
      this.meta = new MetaDataDto(page, perPage, total)
      this.data = data;
    }
}