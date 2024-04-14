import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/database/entities/mariadb/Role.entity';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { RoleRepository } from './role.repository';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    TypeOrmExModule.forCustomRepository([RoleRepository, UserRepository]),
    RolePermissionModule,
  ],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
