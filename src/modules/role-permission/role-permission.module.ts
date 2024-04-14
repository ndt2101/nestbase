import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from 'src/database/entities/mariadb/RolePermission.entity';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RolePermisisonRepository } from './role-permission.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([RolePermission]),
        TypeOrmExModule.forCustomRepository([RolePermisisonRepository])
    ],
    providers: [RolePermissionService],
    controllers: [RolePermissionController],
    exports: [RolePermissionService]
})
export class RolePermissionModule {}
