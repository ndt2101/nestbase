import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PodRepository } from './pod.repository';
import { PodQueryDto } from './dto/podQuery.dto';
import { Pod } from 'src/database/entities/postgre/Pod.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { CreatePodDto } from './dto/createPod.dto';
import { UpdatePodDto } from './dto/updatePod.dto';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { Rack } from 'src/database/entities/postgre/Rack.entity';
import { Location } from 'src/database/entities/postgre/Location.entity';
import { DB_CONNECTION } from '@common/constants/global.const';
import { LocationToPodDto } from './dto/locationToPod.dto';
import { LocationRepository } from '../location/location.repository';
import { RackToPodDto } from './dto/rackToPod.dto';
import { RackRepository } from '../rack/rack.repository';
import { DeleteMultiplePodDto } from './dto/deleteMultiplePod.dto';
import { Site } from 'src/database/entities/postgre/Site.entity';
import { SiteRepository } from '../site/site.repository';
import { HTTPNotFoundException } from 'src/exceptions/http-not-found.filter';

@Injectable()
export class PodService {
  constructor(
    @InjectRepository(Pod, DB_CONNECTION.DCIM)
    private readonly podRepository: PodRepository,
    @InjectRepository(Location, DB_CONNECTION.DCIM)
    private readonly locationRepository: LocationRepository,
    @InjectRepository(Rack, DB_CONNECTION.DCIM)
    private readonly rackRepository: RackRepository,
    @InjectRepository(Site, DB_CONNECTION.DCIM)
    private readonly siteRepository: SiteRepository,
    @InjectDataSource(DB_CONNECTION.DCIM)
    private readonly dataSource: DataSource,
  ) {}

  async getAll(podQueryDto: PodQueryDto): Promise<PaginationDto<Pod>> {
    const skipCount = (podQueryDto.page - 1) * podQueryDto.per_page;
    const query = this.podRepository
      .createQueryBuilder('pods')
      .leftJoinAndSelect('pods.infrastructureType', 'infrastructureType');

    if (podQueryDto.filter) {
      query.where('pods.name LIKE :pattern', {
        pattern: `%${podQueryDto.filter}%`,
      });
    }

    if (podQueryDto.site_names) {
      const listSiteName = podQueryDto.site_names.split(',');
      query.andWhere('pods.site_name IN (:...listSiteName)', {
        listSiteName: listSiteName,
      });
    }

    if (podQueryDto.region_names) {
      const listRegionName = podQueryDto.region_names.split(',');
      query.andWhere('pods.region_name IN (:...listRegionName)', {
        listRegionName: listRegionName,
      });
    }

    if (podQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        podQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'pods.infrastructure_type_id IN (:...listInfrastructureTypeIds)',
        {
          listInfrastructureTypeIds: listInfrastructureTypeIds,
        },
      );
    }

    const [items, totalItems] = await query
      .loadRelationCountAndMap('pods.rackCount', 'pods.racks')
      .loadRelationCountAndMap('pods.locationCount', 'pods.locations')
      .skip(skipCount)
      .take(podQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      podQueryDto.page,
      podQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async exportPodData(podQueryDto: PodQueryDto): Promise<Pod[]> {
    const query = this.podRepository
      .createQueryBuilder('pods')
      .leftJoinAndSelect('pods.infrastructureType', 'infrastructureType');

    if (podQueryDto.filter) {
      query.where('pods.name LIKE :pattern', {
        pattern: `%${podQueryDto.filter}%`,
      });
    }

    if (podQueryDto.site_names) {
      const listSiteName = podQueryDto.site_names.split(',');
      query.andWhere('pods.site_name IN (:...listSiteName)', {
        listSiteName: listSiteName,
      });
    }

    if (podQueryDto.region_names) {
      const listRegionName = podQueryDto.region_names.split(',');
      query.andWhere('pods.region_name IN (:...listRegionName)', {
        listRegionName: listRegionName,
      });
    }

    if (podQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        podQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'pods.infrastructure_type_id IN (:...listInfrastructureTypeIds)',
        {
          listInfrastructureTypeIds: listInfrastructureTypeIds,
        },
      );
    }

    return await query
      .loadRelationCountAndMap('pods.racks', 'pods.racks')
      .loadRelationCountAndMap('pods.locations', 'pods.locations')
      .getMany();
  }

  async create(createPodDto: CreatePodDto): Promise<Pod> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const podRepo = queryRunner.manager.getRepository(Pod);
      const newPod = await podRepo.save({
        name: createPodDto.name,
        infrastructure_type_id: createPodDto.infrastructure_type_id,
        region_name: createPodDto.region_name,
        site_name: createPodDto.site_name,
      });
      await queryRunner.commitTransaction();
      return newPod;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async addLocationToPod(
    id: number,
    locationToPodDto: LocationToPodDto,
  ): Promise<void> {
    this.locationRepository
      .createQueryBuilder('dcim_location')
      .update(Location)
      .set({
        pod_id: id,
      })
      .where('id in(:...id) ', { id: locationToPodDto.location_ids })
      .execute();
  }

  async addRackToPod(id: number, rackToPodDto: RackToPodDto): Promise<void> {
    this.rackRepository
      .createQueryBuilder('dcim_rack')
      .update(Rack)
      .set({
        pod_id: id,
      })
      .where('id in(:...id) ', { id: rackToPodDto.rack_ids })
      .execute();
  }

  async importLocationToPod(podId: number, listlocationName): Promise<[]> {
    const detailPod = await this.podRepository
      .createQueryBuilder('pods')
      .where('pods.id = :id', { id: podId })
      .getOne();
    if (!detailPod) {
      throw new HTTPNotFoundException('NOT FOUND');
    }

    const siteDetail = await this.siteRepository
      .createQueryBuilder('dcim_site')
      .where('name = :name', { name: detailPod.site_name })
      .getOne();

    if (!siteDetail) {
      throw new HTTPNotFoundException('NOT FOUND');
    }

    const listCheckLocations = await this.locationRepository
      .createQueryBuilder('dcim_location')
      .where('site_id = :site_id', { site_id: siteDetail.id })
      .getMany();

    const dataInsert = [];
    const validatedData = listlocationName.map((location) => {
      let checkExist = false;
      if (!location[2]) {
        listCheckLocations.forEach((item) => {
          if (item.name.localeCompare(location[1]) === 0) {
            dataInsert.push(item.id);
            checkExist = true;
          }
        });
        if (!checkExist) {
          location[2] = 'Location is not belong to correct site';
        }
      }

      return location;
    });

    if (dataInsert.length) {
      this.locationRepository
        .createQueryBuilder('dcim_location')
        .update(Location)
        .set({
          pod_id: podId,
        })
        .where('id in(:...id) ', { id: dataInsert })
        .execute();
    }

    return validatedData;
  }

  async importRackToPod(podId: number, listRackName): Promise<[]> {
    const detailPod = await this.podRepository
      .createQueryBuilder('pods')
      .where('pods.id = :id', { id: podId })
      .getOne();
    if (!detailPod) {
      throw new HTTPNotFoundException('NOT FOUND');
    }

    const siteDetail = await this.siteRepository
      .createQueryBuilder('dcim_site')
      .where('name = :name', { name: detailPod.site_name })
      .getOne();

    if (!siteDetail) {
      throw new HTTPNotFoundException('NOT FOUND');
    }

    const listCheckRacks = await this.rackRepository
      .createQueryBuilder('dcim_rack')
      .where('site_id = :site_id', { site_id: siteDetail.id })
      .getMany();

    const dataInsert = [];
    const validatedData = listRackName.map((location) => {
      let checkExist = false;
      if (!location[3]) {
        listCheckRacks.forEach((item) => {
          if (item.name.localeCompare(location[1]) === 0) {
            dataInsert.push(item.id);
            checkExist = true;
          }
        });
        if (!checkExist) {
          location[3] = 'Rack is not belong to correct location';
        }
      }

      return location;
    });

    if (dataInsert.length) {
      this.rackRepository
        .createQueryBuilder('dcim_rack')
        .update(Rack)
        .set({
          pod_id: podId,
        })
        .where('id in(:...id) ', { id: dataInsert })
        .execute();
    }

    return validatedData;
  }

  async removeLocation(
    id: number,
    locationToPodDto: LocationToPodDto,
  ): Promise<void> {
    this.locationRepository
      .createQueryBuilder('dcim_location')
      .update(Location)
      .set({
        pod_id: null,
      })
      .where('id in(:...id) ', { id: locationToPodDto.location_ids })
      .execute();
  }

  async removeRack(id: number, rackToPodDto: RackToPodDto): Promise<void> {
    this.locationRepository
      .createQueryBuilder('dcim_rack')
      .update(Rack)
      .set({
        pod_id: null,
      })
      .where('id in(:...id) ', { id: rackToPodDto.rack_ids })
      .execute();
  }

  async show(podId: number): Promise<Pod | null> {
    return await this.podRepository
      .createQueryBuilder('pods')
      .leftJoinAndSelect('pods.infrastructureType', 'infrastructureType')
      .where('pods.id = :id', { id: podId })
      .loadRelationCountAndMap('pods.rackCount', 'pods.racks')
      .getOne();
  }

  async update(id: number, updatePodDto: UpdatePodDto): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const podRepo = queryRunner.manager.getRepository(Pod);
      await podRepo.update(id, {
        name: updatePodDto.name,
        infrastructure_type_id: updatePodDto.infrastructure_type_id,
        region_name: updatePodDto.region_name,
        site_name: updatePodDto.site_name,
      });
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.podRepository.delete(id);
  }

  async deleteMultiple(
    deleteMultiplePodDto: DeleteMultiplePodDto,
  ): Promise<DeleteResult> {
    return await this.podRepository.delete(deleteMultiplePodDto.pod_ids);
  }
}
