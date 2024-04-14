import { Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/mariadb/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQueryDto } from './dto/UserQueryDto.dto';
import { In } from 'typeorm';
import axios from 'axios';
import { UserRepository } from './user.repository';
import { SetRoleDto } from './dto/setRole.dto';
import { RoleRepository } from '../role/role.repository';
import { PaginationDto } from '@common/dto/pagination.dto';
import { SYNC_USER_DATA } from '@common/constants/sync-job.const';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {}

  public async getAll(
    userQueryDto: UserQueryDto,
  ): Promise<PaginationDto<User>> {
    return await this.userRepository.findAll(userQueryDto);
  }

  public async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      relations: ['roles', 'roles.role_permissions'],
      where: { username: username },
    });
  }

  public async getUserByRoleId(
    roleId: number,
    userQueryDto: UserQueryDto,
  ): Promise<PaginationDto<User>> {
    return await this.userRepository.getUserByRoleId(roleId, userQueryDto);
  }

  public async show(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      relations: ['roles', 'roles.role_permissions'],
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`user with id ${userId} not found.`);
    }

    return user;
  }

  public async setRoles(userId: number, setRoleDto: SetRoleDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        relations: {
          roles: true,
        },
        where: { id: userId },
      });
      if (!user) {
        throw new Error(`user with id ${userId} not found.`);
      }
      const roles = await this.roleRepository.find({
        where: {
          id: In(setRoleDto.roles),
        },
      });
      user.roles = roles;
      const result = await this.userRepository.save(user);

      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async synchronizingDataUser(): Promise<string> {
    let conditionCheck = true;
    const jsonUserData = {
      content: [],
    };
    let page = 1;
    while (conditionCheck) {
      const jsonResponse = await this.fetchDataUsers(page);
      if (jsonResponse && jsonResponse.content) {
        jsonUserData.content = [
          ...jsonUserData.content,
          ...jsonResponse.content,
        ];
        page++;
        console.log('count:', jsonUserData.content.length);
      } else {
        conditionCheck = false;
        page = 0;
      }
      console.log('service_fetch_user_data-page: ', page);
    }

    const listExistUsers = await this.userRepository.find();
    const dataInserts = [];
    if (jsonUserData.content.length) {
      jsonUserData.content.forEach((user) => {
        const isFound = listExistUsers.some((item) => {
          if (item.staff_code === user.employeeCode) {
            return true;
          }

          return false;
        });
        if (user.status == 1 && !isFound) {
          const data = {
            username: user.email
              ? user.email.substring(0, user.email.lastIndexOf('@'))
              : user.employeeCode,
            fullname: user.fullName ?? null,
            email: user.email ?? null,
            staff_code: user.employeeCode ?? null,
            status: user.status ?? null,
            address: null,
            city: null,
            country: user.countryCode ?? null,
            phone: user.mobileNumber ?? null,
            birthday: null,
            timezone: 'Asia/Ho_Chi_Minh',
            language: 'vi',
            gender: user.gender ?? null,
            positionName: user.positionName ?? null,
            organizationName: user.organizationName ?? null,
            departmentName: user.departmentName ?? null,
            department_id: user.organizationId ?? null,
          };

          dataInserts.push(data);
        }
      });
      await this.userRepository.clear();
      await this.userRepository.save(dataInserts);
      return 'Inserted completed';
    }

    return 'Inserted successfully';
  }

  private async fetchDataUsers(page: number) {
    const apiUrl = SYNC_USER_DATA.API_URL + page;
    return axios
      .get(apiUrl, {
        auth: {
          username: SYNC_USER_DATA.USER_NAME,
          password: SYNC_USER_DATA.PASSWORD,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const jsonResponse = response.data;
        console.log('json_service:', '-- ' + page);
        if (jsonResponse.content && jsonResponse.content.length) {
          return jsonResponse;
        }

        return false;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
