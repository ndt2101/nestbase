import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/mariadb/User.entity';
import { UserRepository } from './user.repository';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { RoleModule } from '../role/role.module';
import { RoleRepository } from '../role/role.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User
        ]),
        TypeOrmExModule.forCustomRepository([UserRepository, RoleRepository]),
        RoleModule
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
