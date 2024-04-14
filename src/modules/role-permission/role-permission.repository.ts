import { CustomRepository } from "@common/decorators/typeorm-ex.decorator"
import { RolePermission } from "src/database/entities/mariadb/RolePermission.entity"
import { Repository } from "typeorm"

@CustomRepository(RolePermission)
export class RolePermisisonRepository extends Repository<RolePermission> {
    async getPermisisonByRoleId(roleId: number) : Promise<RolePermission[] | []> {
        let query = this.createQueryBuilder("role_permission")
            .where('role_permission.role_id = :roleId', { roleId: roleId });

        return await query.getMany();
    }
}