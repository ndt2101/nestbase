import { IsArray } from "class-validator";

export class AssignRoleDto {
    @IsArray({
        message: "Users must be an array"
    })
    users: number[]
}