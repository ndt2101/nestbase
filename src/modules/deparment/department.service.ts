import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/database/entities/mariadb/Department.entity';
import { DepartmentQueryDto } from './dto/departmentQueryDto.dto';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import { DepartmentRepository } from './department.repository';
import { PaginationDto } from '@common/dto/pagination.dto';
import { SYNC_DEPARTMENT_DATA } from '@common/constants/sync-job.const';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentRepository)
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async getAll(
    departmentQueryDto: DepartmentQueryDto,
  ): Promise<PaginationDto<Department>> {
    return this.departmentRepository.findAll(departmentQueryDto);
  }

  async show(id: number): Promise<Department | null> {
    return this.departmentRepository.findOneById(id);
  }

  async synchronizingDataDepartment(): Promise<string> {
    let conditionCheck = true;
    const jsonDepartmentData = {
      content: [],
    };
    let page = 1;
    while (conditionCheck) {
      const jsonResponse = await this.fetchDataDepartments(page);
      if (jsonResponse && jsonResponse.content) {
        jsonDepartmentData.content = [
          ...jsonDepartmentData.content,
          ...jsonResponse.content,
        ];
        page++;
        console.log('count:', jsonDepartmentData.content.length);
      } else {
        conditionCheck = false;
        page = 0;
      }
      console.log('service_fetch_department_data-page: ', page);
    }
    const listExistDepartments = await this.departmentRepository.find();
    console.log(listExistDepartments[0])

    const dataInserts = [];
    if (jsonDepartmentData.content.length) {
      jsonDepartmentData.content.forEach((department) => {
        const isFound = listExistDepartments.some(item => {
          if (item.organization_id === department.organizationId) {
            return true;
          }
        
          return false;
        });
        if (department.status == 1 && !isFound) {
          const data = {
            name: department.englishName ?? null,
            fullname: department.name ?? null,
            parent_id: department.orgParentId ?? null,
            organization_id: department.organizationId ?? null,
            topdown_route: department.path ?? null,
            topdown_level: department.orgLevel ?? null,
            manager_id: department.orgManagerId ?? null,
            user_count: department.totalEmp || 0,
            recursive_user_count: 0,
            sub_department_count: 0,
            recursive_sub_department_count: 0,
          };

          dataInserts.push(data);
        }
      });

      await this.departmentRepository.clear();
      await this.departmentRepository.save(dataInserts);
      return 'Inserted completed';
    }

    return 'Inserted successfully';
  }

  private async fetchDataDepartments(page: number) {
    const apiUrl = SYNC_DEPARTMENT_DATA.API_URL + page;
    return axios
      .get(apiUrl, {
        auth: {
          username: SYNC_DEPARTMENT_DATA.USER_NAME,
          password: SYNC_DEPARTMENT_DATA.PASSWORD,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const jsonResponse = response.data;
        console.log('json_service:', '-- ' + '--' + page);
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
