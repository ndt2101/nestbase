import { CustomRepository } from "@common/decorators/typeorm-ex.decorator";
import { Department } from "src/database/entities/mariadb/Department.entity";
import { Repository } from "typeorm";
import { DepartmentQueryDto } from "./dto/departmentQueryDto.dto";
import { PaginationDto } from "@common/dto/pagination.dto";

@CustomRepository(Department)
export class DepartmentRepository extends Repository<Department> {
    async findAll(departmentQueryDto: DepartmentQueryDto) : Promise<PaginationDto<Department>> {
        let skipCount = (departmentQueryDto.page - 1) * departmentQueryDto.per_page
        let query = this.createQueryBuilder("departments");

        if (departmentQueryDto.filter) {
            query.where('departments.fullname LIKE :pattern', { pattern: `%${departmentQueryDto.filter}%` });
        }
        const [items, totalItems] = await query.skip(skipCount)
            .take(departmentQueryDto.per_page)
            .getManyAndCount();

        return new PaginationDto(departmentQueryDto.page, departmentQueryDto.per_page, totalItems, items);
    }
}