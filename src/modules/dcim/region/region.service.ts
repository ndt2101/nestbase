import { Injectable } from '@nestjs/common';
import { Region } from 'src/database/entities/postgre/Region.entity';
import { RegionRepository } from './region.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionQueryDto } from './dto/regionQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DB_CONNECTION } from '@common/constants/global.const';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region, DB_CONNECTION.DCIM)
    private readonly regionRepository: RegionRepository,
  ) {}

  async getAll(regionQueryDto: RegionQueryDto): Promise<PaginationDto<Region>> {
    const skipCount = (regionQueryDto.page - 1) * regionQueryDto.per_page;
    const query = this.regionRepository.createQueryBuilder('dcim_region');

    if (regionQueryDto.filter) {
      query.where('dcim_region.name LIKE :pattern', {
        pattern: `%${regionQueryDto.filter}%`,
      });
    }
    const [items, totalItems] = await query
      .skip(skipCount)
      .take(regionQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      regionQueryDto.page,
      regionQueryDto.per_page,
      totalItems,
      items,
    );
  }
}
