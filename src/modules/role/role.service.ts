import { HttpException, Injectable } from '@nestjs/common';
import { Role } from 'src/database/entities/mariadb/Role.entity';
import { RoleQueryDto } from './dto/roleQuery.dto';
import { DeleteResult, In, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RoleRepository } from './role.repository';
import { AssignRoleDto } from './dto/assignRole.dto';
import { UserRepository } from '../user/user.repository';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(roleQueryDto: RoleQueryDto): Promise<PaginationDto<Role>> {
    return await this.roleRepository.findAll(roleQueryDto);
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleRepository.save(createRoleDto);
  }

  async show(roleId: number): Promise<Role | null> {
    return await this.roleRepository.findOne({
      relations: {
        users: true,
      },
      where: { id: roleId },
    });
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateResult> {
    const createdUser = await this.roleRepository.update(id, updateRoleDto);

    return createdUser;
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.roleRepository.delete(id);

    return;
  }

  async assignUserRole(
    roleId: number,
    assignRoleDto: AssignRoleDto,
  ): Promise<Role> {
    try {
      let role = await this.roleRepository.findOne({
        relations: {
          users: true,
        },
        where: { id: roleId },
      });
      if (!role) {
        throw new HttpException(
          { message: `role with id ${roleId} not found.` },
          404,
        );
      }
      let users = await this.userRepository.find({
        where: {
          id: In(assignRoleDto.users),
        },
      });
      if (role.users.length) {
        users.forEach((user) => {
          const result = role.users.find(({ id }) => id === user.id);
          if (!result) {
            role.users.push(user);
          }
        });
      } else {
        role.users = users;
      }

      return await this.roleRepository.save(role);
    } catch (err) {
      console.log(err);
    }
  }

  async unassignUserRole(
    roleId: number,
    assignRoleDto: AssignRoleDto,
  ): Promise<Role> {
    try {
      let role = await this.roleRepository.findOne({
        relations: {
          users: true,
        },
        where: { id: roleId },
      });
      if (!role) {
        throw new Error(`role with id ${roleId} not found.`);
      }
      role.users = role.users.filter(
        (user) => !assignRoleDto.users.includes(user.id),
      );

      return await this.roleRepository.save(role);
    } catch (err) {
      console.log(err);
    }
  }
}
