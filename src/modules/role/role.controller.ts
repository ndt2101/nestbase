import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors
} from '@nestjs/common';
import { Role } from 'src/database/entities/mariadb/Role.entity';
import { RoleService } from './role.service';
import { RoleQueryDto } from './dto/roleQuery.dto';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { SetPermissionDto } from './dto/setPermisison.dto';
import { AssignRoleDto } from './dto/assignRole.dto';
import { RolePermission } from 'src/database/entities/mariadb/RolePermission.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PermissionEnum } from '@common/enums/permisison.enum';
import { Permissions } from '@common/decorators/permission.decorator';
import { ContextInterceptor } from '@common/interceptors/context.interceptor';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly rolePermissionService: RolePermissionService,
  ) {}
  @Get('/')
  async index(
    @Query() roleQueryDto: RoleQueryDto,
  ): Promise<PaginationDto<Role>> {
    return await this.roleService.getAll(roleQueryDto);
  }

  @Post('/')
  @Permissions(PermissionEnum.CREATE_ROLE)
  async store(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleService.create(createRoleDto);
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.roleService.show(+id);
  }

  @Put(':id')
  @UseInterceptors(ContextInterceptor)
  @Permissions(PermissionEnum.UPDATE_ROLE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Post(':id/set-permissions')
  @Permissions(PermissionEnum.SET_PERMISSION)
  setPermisison(
    @Param('id', ParseIntPipe) id: number,
    @Body() setPermissionDto: SetPermissionDto,
  ): Promise<Role> {
    return this.rolePermissionService.setPermisisons(id, setPermissionDto);
  }

  @Get(':id/get-permissions')
  @Permissions(PermissionEnum.GET_PERMISSISON)
  getPermisison(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RolePermission[] | []> {
    return this.rolePermissionService.getPermisisonByRoleId(id);
  }

  @Post(':id/assign-user')
  @Permissions(PermissionEnum.ASSIGN_ROLE_USER)
  assignUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<Role> {
    return this.roleService.assignUserRole(id, assignRoleDto);
  }

  @Post(':id/unassign-user')
  @Permissions(PermissionEnum.UNASSIGN_ROLE_USER)
  unassignUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<Role> {
    return this.roleService.unassignUserRole(id, assignRoleDto);
  }

  @Delete(':id')
  @Permissions(PermissionEnum.DELETE_ROLE)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(+id);
  }
}
