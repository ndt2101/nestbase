import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rack } from 'src/database/entities/postgre/Rack.entity';
import { RackRepository } from './rack.repository';
import { RackQueryDto } from './dto/rackQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DB_CONNECTION } from '@common/constants/global.const';

@Injectable()
export class RackService {
  constructor(
    @InjectRepository(Rack, DB_CONNECTION.DCIM)
    private readonly rackRepository: RackRepository,
  ) {}

  async getAll(rackQueryDto: RackQueryDto): Promise<PaginationDto<Rack>> {
    const skipCount = (rackQueryDto.page - 1) * rackQueryDto.per_page;
    const query = this.rackRepository.createQueryBuilder('dcim_rack');

    if (rackQueryDto.filter) {
      query.andWhere('dcim_rack.name LIKE :pattern', {
        pattern: `%${rackQueryDto.filter}%`,
      });
    }
    if (rackQueryDto.site_id) {
      query.andWhere('dcim_rack.site_id = :site_id', {
        site_id: rackQueryDto.site_id,
      });
    }

    if (rackQueryDto.pod_id) {
      query.andWhere('dcim_rack.pod_id = :pod_id', {
        pod_id: rackQueryDto.pod_id,
      });
    }

    if (rackQueryDto.location_ids) {
      const filterlocationIds = rackQueryDto.location_ids.split(',');
      console.log('filterlocationIds: ', filterlocationIds);
      query.andWhere('dcim_rack.location_id IN (:...location_ids)', {
        location_ids: filterlocationIds,
      });
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(rackQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      rackQueryDto.page,
      rackQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async getRackByPod(rackQueryDto: RackQueryDto): Promise<PaginationDto<Rack>> {
    const skipCount = (rackQueryDto.page - 1) * rackQueryDto.per_page;
    const query = this.rackRepository
      .createQueryBuilder('dcim_rack')
      .leftJoinAndSelect('dcim_rack.location', 'location');
    if (rackQueryDto.filter) {
      query.andWhere('dcim_rack.name LIKE :pattern', {
        pattern: `%${rackQueryDto.filter}%`,
      });
    }
    if (rackQueryDto.site_id) {
      query.andWhere('dcim_rack.site_id = :site_id', {
        site_id: rackQueryDto.site_id,
      });
    }

    if (rackQueryDto.pod_id) {
      query.andWhere('dcim_rack.pod_id = :pod_id', {
        pod_id: rackQueryDto.pod_id,
      });
    }

    if (rackQueryDto.location_ids) {
      const listlocationIds = rackQueryDto.location_ids.split(',');
      query.andWhere('dcim_rack.location_id IN (:...location_ids)', {
        location_ids: listlocationIds,
      });
    }

    const [items, totalItems] = await query
      .loadRelationCountAndMap(
        'dcim_rack.deviceCount',
        'dcim_rack.devices',
        'deviceCount',
        (qb) =>
          qb.where(
            'COALESCE(load_balancer_id, firewall_id, switch_id) IS NOT NULL',
          ),
      )
      .skip(skipCount)
      .take(rackQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      rackQueryDto.page,
      rackQueryDto.per_page,
      totalItems,
      items,
    );
  }
  async exportRackByPodData(rackQueryDto: RackQueryDto): Promise<Rack[]> {
    const query = this.rackRepository
      .createQueryBuilder('dcim_rack')
      .leftJoinAndSelect('dcim_rack.location', 'location');
    if (rackQueryDto.filter) {
      query.andWhere('dcim_rack.name LIKE :pattern', {
        pattern: `%${rackQueryDto.filter}%`,
      });
    }
    if (rackQueryDto.site_id) {
      query.andWhere('dcim_rack.site_id = :site_id', {
        site_id: rackQueryDto.site_id,
      });
    }

    if (rackQueryDto.pod_id) {
      query.andWhere('dcim_rack.pod_id = :pod_id', {
        pod_id: rackQueryDto.pod_id,
      });
    }

    if (rackQueryDto.location_ids) {
      const listlocationIds = rackQueryDto.location_ids.split(',');
      query.andWhere('dcim_rack.location_id IN (:...location_ids)', {
        location_ids: listlocationIds,
      });
    }

    return await query
      .loadRelationCountAndMap(
        'dcim_rack.devices',
        'dcim_rack.devices',
        'devices',
        (qb) =>
          qb.where(
            'COALESCE(load_balancer_id, firewall_id, switch_id) IS NOT NULL',
          ),
      )
      .getMany();
  }
}
