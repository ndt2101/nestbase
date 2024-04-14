import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserQueryDto } from './dto/UserQueryDto.dto';
import { User } from 'src/database/entities/mariadb/User.entity';
import { SetRoleDto } from './dto/setRole.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permission.decorator';
import { PermissionEnum } from '@common/enums/permisison.enum';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    async index(@Query() userQueryDto: UserQueryDto): Promise<PaginationDto<User>> {
        return await this.userService.getAll(userQueryDto)
    }

    @Get(':id')
    async show(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
        return this.userService.show(id)
    }

    @Get('/user-by-role/:roleId')
    async getUserByRoleId(@Param('roleId', ParseIntPipe) roleId: number,@Query() userQueryDto: UserQueryDto): Promise<PaginationDto<User>> {
        return await this.userService.getUserByRoleId(roleId, userQueryDto)
    }

    @Post(':id/set-role')
    @Permissions(PermissionEnum.ASSIGN_ROLE_USER)
    async setRoles(@Param('id', ParseIntPipe) id: number, @Body() setRoleDto: SetRoleDto): Promise<User> {
        return await this.userService.setRoles(id, setRoleDto) 
    }

    @Get('/authenticated/user-info')
    async getUserInfo(@Req() request): Promise<User> {
        let authenticateddUser = request.user

        return await this.userService.show(authenticateddUser.id)
    }
}
