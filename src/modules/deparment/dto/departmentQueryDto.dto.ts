import { BaseDto } from "@base/base.dto";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class DepartmentQueryDto extends BaseDto {
    @IsString()
    @IsOptional()
    filter?: string;
    
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(1000)
    per_page?: number;
}