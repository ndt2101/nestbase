import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { Role } from 'src/database/entities/mariadb/Role.entity';
import { Repository } from 'typeorm';
import { RoleQueryDto } from './dto/roleQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {
  async findAll(roleQueryDto: RoleQueryDto): Promise<PaginationDto<Role>> {
    const skipCount = (roleQueryDto.page - 1) * roleQueryDto.per_page;
    const query = this.createQueryBuilder('roles').leftJoinAndSelect(
      'roles.users',
      'users',
    );

    if (roleQueryDto.filter) {
      query.where('roles.name LIKE :pattern', {
        pattern: `%${roleQueryDto.filter}%`,
      });
    }
    const [items, totalItems] = await query
      .skip(skipCount)
      .take(roleQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      roleQueryDto.page,
      roleQueryDto.per_page,
      totalItems,
      items,
    );
  }
}
