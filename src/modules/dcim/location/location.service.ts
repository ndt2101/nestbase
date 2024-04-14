import { DB_CONNECTION } from '@common/constants/global.const';
import { Injectable } from '@nestjs/common';
import { Location } from 'src/database/entities/postgre/Location.entity';
import { LocationRepository } from './location.repository';
import { LocationQueryDto } from './dto/locationQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location, DB_CONNECTION.DCIM)
    private readonly locationRepository: LocationRepository,
  ) {}

  async getAll(
    locationQueryDto: LocationQueryDto,
  ): Promise<PaginationDto<Location>> {
    const skipCount = (locationQueryDto.page - 1) * locationQueryDto.per_page;
    const query = this.locationRepository.createQueryBuilder('dcim_location');

    if (locationQueryDto.filter) {
      query.andWhere('dcim_location.name LIKE :pattern', {
        pattern: `%${locationQueryDto.filter}%`,
      });
    }

    if (locationQueryDto.site_id) {
      query.andWhere('dcim_location.site_id = :site_id', {
        site_id: locationQueryDto.site_id,
      });
    }

    if (locationQueryDto.pod_id) {
      query.andWhere('dcim_location.pod_id = :pod_id', {
        pod_id: locationQueryDto.pod_id,
      });
    }
    const [items, totalItems] = await query
      .skip(skipCount)
      .take(locationQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      locationQueryDto.page,
      locationQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async exportLocationByPodData(
    locationQueryDto: LocationQueryDto,
  ): Promise<Location[]> {
    const query = this.locationRepository
      .createQueryBuilder('dcim_location')
      .leftJoinAndSelect('dcim_location.pod', 'pod');

    if (locationQueryDto.filter) {
      query.andWhere('dcim_location.name LIKE :pattern', {
        pattern: `%${locationQueryDto.filter}%`,
      });
    }
    if (locationQueryDto.site_id) {
      query.andWhere('dcim_location.site_id = :site_id', {
        site_id: locationQueryDto.site_id,
      });
    }

    if (locationQueryDto.pod_id) {
      query.andWhere('dcim_location.pod_id = :pod_id', {
        pod_id: locationQueryDto.pod_id,
      });
    }

    return await query
      .loadRelationCountAndMap('dcim_location.racks', 'dcim_location.racks')
      .getMany();
  }

  async getLocationByPod(
    locationQueryDto: LocationQueryDto,
  ): Promise<PaginationDto<Location>> {
    const skipCount = (locationQueryDto.page - 1) * locationQueryDto.per_page;
    const query = this.locationRepository.createQueryBuilder('dcim_location');

    if (locationQueryDto.filter) {
      query.andWhere('dcim_location.name LIKE :pattern', {
        pattern: `%${locationQueryDto.filter}%`,
      });
    }
    if (locationQueryDto.site_id) {
      query.andWhere('dcim_location.site_id = :site_id', {
        site_id: locationQueryDto.site_id,
      });
    }

    if (locationQueryDto.pod_id) {
      query.andWhere('dcim_location.pod_id = :pod_id', {
        pod_id: locationQueryDto.pod_id,
      });
    }

    const [items, totalItems] = await query
      .loadRelationCountAndMap('dcim_location.rackCount', 'dcim_location.racks')
      .skip(skipCount)
      .take(locationQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      locationQueryDto.page,
      locationQueryDto.per_page,
      totalItems,
      items,
    );
  }
}
