import { IsArray } from "class-validator";

export class SetRoleDto {
    @IsArray({
        message: "Roles must be an array"
    })
    roles: number[]
}