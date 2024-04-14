import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { User } from 'src/database/entities/mariadb/User.entity';
import { Repository } from 'typeorm';
import { UserQueryDto } from './dto/UserQueryDto.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    async findAll(userQueryDto: UserQueryDto): Promise<PaginationDto<User>> {
        let skipCount = (userQueryDto.page - 1) * userQueryDto.per_page
        let query = this.createQueryBuilder("users")
            .leftJoinAndSelect('users.department', 'department');

        if (userQueryDto.filter) {
            query.where('users.username LIKE :pattern', { pattern: `%${userQueryDto.filter}%` })
                .orWhere('users.fullname LIKE :pattern', { pattern: `%${userQueryDto.filter}%` });
        }
        const [items, totalItems] = await query.skip(skipCount)
            .take(userQueryDto.per_page)
            .getManyAndCount();

        return new PaginationDto(userQueryDto.page, userQueryDto.per_page, totalItems, items);
    }

    async getUserByRoleId(roleId: number, userQueryDto: UserQueryDto): Promise<PaginationDto<User>> {
        let skipCount = (userQueryDto.page - 1) * userQueryDto.per_page
        let query = this.createQueryBuilder("users")
            .innerJoinAndSelect('users.roles', 'role', 'role.id = :roleId', { roleId });
            if (userQueryDto.filter) {
            query.where('users.username LIKE :pattern', { pattern: `%${userQueryDto.filter}%` })
                .orWhere('users.fullname LIKE :pattern', { pattern: `%${userQueryDto.filter}%` });
            }

        const [items, totalItems] = await query.skip(skipCount)
            .take(userQueryDto.per_page)
            .getManyAndCount();
        
        const totalPages = Math.ceil(totalItems / userQueryDto.per_page);

        return new PaginationDto(userQueryDto.page, userQueryDto.per_page, totalItems, items);
    }
}