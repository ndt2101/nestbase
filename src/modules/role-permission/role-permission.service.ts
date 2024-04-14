import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermisisonRepository } from './role-permission.repository';
import { DataSource } from 'typeorm';
import { SetPermissionDto } from '../role/dto/setPermisison.dto';
import { RolePermission } from 'src/database/entities/mariadb/RolePermission.entity';

@Injectable()
export class RolePermissionService {
    constructor(
        @InjectRepository(RolePermisisonRepository)
        private readonly rolePermissionRepository: RolePermisisonRepository,
        private dataSource: DataSource
    ) {}

    async setPermisisons(roleId: number, setPermissionDto: SetPermissionDto): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let dataInsert = []
            if(setPermissionDto.permissions && setPermissionDto.permissions.length) {
                setPermissionDto.permissions.forEach(permissionName => {
                    let data = {
                        role_id: roleId,
                        name: permissionName
                    }

                    dataInsert.push(data)
                });
            }
            await queryRunner.manager.withRepository(this.rolePermissionRepository).delete({
                "role_id": roleId
            })

            let results = await queryRunner.manager.withRepository(this.rolePermissionRepository).save(dataInsert)

            await queryRunner.commitTransaction();

            return results
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async getPermisisonByRoleId(roleId: number): Promise<RolePermission[] | []> {
        return await this.rolePermissionRepository.getPermisisonByRoleId(roleId)
    }
}
