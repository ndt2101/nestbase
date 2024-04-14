import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentQueryDto } from './dto/departmentQueryDto.dto';
import { Department } from 'src/database/entities/mariadb/Department.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('departments')
export class DeparmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get('/')
  async index(
    @Query() departmentQueryDto: DepartmentQueryDto,
  ): Promise<PaginationDto<Department>> {
    return await this.departmentService.getAll(departmentQueryDto);
  }

  @Get(':id')
  async show(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Department | null> {
    return await this.departmentService.show(id);
  }
}
