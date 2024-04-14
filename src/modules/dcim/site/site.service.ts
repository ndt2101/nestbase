import { Injectable } from '@nestjs/common';
import { Site } from 'src/database/entities/postgre/Site.entity';
import { SiteRepository } from './site.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@common/dto/pagination.dto';
import { SiteQueryDto } from './dto/siteQuery.dto';
import { DB_CONNECTION } from '@common/constants/global.const';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site, DB_CONNECTION.DCIM)
    private readonly siteRepository: SiteRepository,
  ) {}

  async getAll(siteQueryDto: SiteQueryDto): Promise<PaginationDto<Site>> {
    const skipCount = (siteQueryDto.page - 1) * siteQueryDto.per_page;
    const query = this.siteRepository.createQueryBuilder('dcim_site');

    if (siteQueryDto.filter) {
      query.andWhere('dcim_site.name LIKE :pattern', {
        pattern: `%${siteQueryDto.filter}%`,
      });
    }
    if (siteQueryDto.region_ids) {
      const regionIds = siteQueryDto.region_ids.split(',');
      query.andWhere('dcim_site.region_id IN (:...regionIds)', {
        regionIds: regionIds,
      });
    }
    const [items, totalItems] = await query
      .skip(skipCount)
      .take(siteQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      siteQueryDto.page,
      siteQueryDto.per_page,
      totalItems,
      items,
    );
  }
}
