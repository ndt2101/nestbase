import { IsArray } from "class-validator";

export class SetPermissionDto {
    @IsArray({
        message: "Permissions must be an array"
    })
    permissions: string[]
}