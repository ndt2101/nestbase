import { Expose, Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class MetaDataDto {
    @Expose()
    @Type(() => Number)
    page: number;
  
    @Expose()
    @IsInt()
    @Min(1)
    @Max(1000)
    @Type(() => Number)
    perPage: number;
  
    @Expose()
    @Type(() => Number)
    total: number;
  
    @Expose()
    @Type(() => Number)
    totalPages: number;
  
    constructor(page: number, perPage: number, total: number) {
      this.page = page ?? 1;
      this.perPage = perPage ?? 20;
      this.total = total ?? 0;
      this.totalPages = Math.ceil(this.total / this.perPage);
    }
}