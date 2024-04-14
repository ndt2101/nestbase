import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InfrastructureType } from 'src/database/entities/postgre/InfrastructureType.entity';
import { InfrastructureTypeRepository } from './infrastructure-type.repository';
import { PaginationDto } from '@common/dto/pagination.dto';
import { InfrastructureTypeQueryDto } from './dto/infrastructureTypeQuery.dto';
import { DB_CONNECTION } from '@common/constants/global.const';

@Injectable()
export class InfrastructureTypeService {
  constructor(
    @InjectRepository(InfrastructureType, DB_CONNECTION.DCIM)
    private readonly infrastructureTypeRepository: InfrastructureTypeRepository,
  ) {}

  async getAll(
    infrastructureTypeQueryDto: InfrastructureTypeQueryDto,
  ): Promise<PaginationDto<InfrastructureType>> {
    const skipCount = (infrastructureTypeQueryDto.page - 1) * infrastructureTypeQueryDto.per_page;
    const query = this.infrastructureTypeRepository.createQueryBuilder('infrastructure_types');

    if (infrastructureTypeQueryDto.filter) {
      query.where('infrastructure_types.name LIKE :pattern', {
        pattern: `%${infrastructureTypeQueryDto.filter}%`,
      });
    }
    const [items, totalItems] = await query
      .skip(skipCount)
      .take(infrastructureTypeQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      infrastructureTypeQueryDto.page,
      infrastructureTypeQueryDto.per_page,
      totalItems,
      items,
    );
  }
}
