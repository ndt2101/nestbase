import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InfrastructureRepository } from './infrastructure.repository';
import { Infrastructure } from 'src/database/entities/postgre/Infrastructure.entity';
import { CreateInfrastructureDto } from './dto/createInfrastructure.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { InfrastructureQueryDto } from './dto/infrastructureQuery.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateInfrastructureDto } from './dto/updateInfrastructure.dto';
import { DB_CONNECTION } from '@common/constants/global.const';
import { DeleteMultipleInfrastrucutreDto } from './dto/deleteMultipleInfrastructure.dto';

@Injectable()
export class InfrastructureService {
  constructor(
    @InjectRepository(Infrastructure, DB_CONNECTION.DCIM)
    private readonly infrastructureRepository: InfrastructureRepository,
  ) {}

  async getAll(
    infrastructureQueryDto: InfrastructureQueryDto,
  ): Promise<PaginationDto<Infrastructure>> {
    const skipCount =
      (infrastructureQueryDto.page - 1) * infrastructureQueryDto.per_page;
    const query = this.infrastructureRepository
      .createQueryBuilder('infrastructures')
      .leftJoinAndSelect(
        'infrastructures.infrastructureType',
        'InfrastructureType',
      );

    if (infrastructureQueryDto.filter) {
      query.andWhere('infrastructures.name LIKE :pattern', {
        pattern: `%${infrastructureQueryDto.filter}%`,
      });
    }
    if (infrastructureQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        infrastructureQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'infrastructures.infrastructure_type_id IN (:...listInfrastructureTypeIds)',
        {
          listInfrastructureTypeIds: listInfrastructureTypeIds,
        },
      );
    }
    if (infrastructureQueryDto.pod_ids) {
      const listPodIds = infrastructureQueryDto.pod_ids.split(',');
      query.andWhere('infrastructures.pod_id IN (:...listPodIds)', {
        listPodIds: listPodIds,
      });
    }
    if (
      infrastructureQueryDto.region_names ||
      infrastructureQueryDto.site_names
    ) {
      query.innerJoinAndSelect('infrastructures.pod', 'pod');
      if (infrastructureQueryDto.region_names) {
        const regionNames = infrastructureQueryDto.region_names.split(',');
        query.andWhere('pod.region_name IN (:...regionNames)', {
          regionNames: regionNames,
        });
      }
      if (infrastructureQueryDto.site_names) {
        const siteNames = infrastructureQueryDto.site_names.split(',');
        query.andWhere('pod.site_name IN (:...siteNames)', {
          siteNames: siteNames,
        });
      }
    } else {
      query.leftJoinAndSelect('infrastructures.pod', 'pod');
    }
    const [items, totalItems] = await query
      .loadRelationCountAndMap('pod.rackCount', 'pod.racks')
      .loadRelationCountAndMap('pod.locationCount', 'pod.locations')
      .loadRelationCountAndMap(
        'infrastructures.hldFileCount',
        'infrastructures.hldFiles',
        'hldFileCount',
        (qb) =>
          qb.where('hldFileCount.entity_type = :entity_type', {
            entity_type: 'Infrastructure',
          }),
      )
      .skip(skipCount)
      .take(infrastructureQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      infrastructureQueryDto.page,
      infrastructureQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async exportInfrastructureData(
    infrastructureQueryDto: InfrastructureQueryDto,
  ): Promise<Infrastructure[]> {
    const query = this.infrastructureRepository
      .createQueryBuilder('infrastructures')
      .leftJoinAndSelect(
        'infrastructures.infrastructureType',
        'InfrastructureType',
      );

    if (infrastructureQueryDto.filter) {
      query.where('infrastructures.name LIKE :pattern', {
        pattern: `%${infrastructureQueryDto.filter}%`,
      });
    }
    if (infrastructureQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        infrastructureQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'infrastructures.infrastructure_type_id IN (:...listInfrastructureTypeIds)',
        {
          listInfrastructureTypeIds: listInfrastructureTypeIds,
        },
      );
    }
    if (infrastructureQueryDto.pod_ids) {
      const listPodIds = infrastructureQueryDto.pod_ids.split(',');
      query.andWhere('infrastructures.pod_id IN (:...listPodIds)', {
        listPodIds: listPodIds,
      });
    }
    if (
      infrastructureQueryDto.region_names ||
      infrastructureQueryDto.site_names
    ) {
      query.innerJoinAndSelect('infrastructures.pod', 'pod');
      if (infrastructureQueryDto.region_names) {
        const regionNames = infrastructureQueryDto.region_names.split(',');
        query.andWhere('pod.region_name IN (:...regionNames)', {
          regionNames: regionNames,
        });
      }
      if (infrastructureQueryDto.site_names) {
        const siteNames = infrastructureQueryDto.site_names.split(',');
        query.andWhere('pod.site_name IN (:...siteNames)', {
          siteNames: siteNames,
        });
      }
    } else {
      query.leftJoinAndSelect('infrastructures.pod', 'pod');
    }
    return await query
      .loadRelationCountAndMap('pod.racks', 'pod.racks')
      .loadRelationCountAndMap('pod.locations', 'pod.locations')
      .loadRelationCountAndMap(
        'infrastructures.hldFileCount',
        'infrastructures.hldFiles',
        'hldFileCount',
        (qb) =>
          qb.where('hldFileCount.entity_type = :entity_type', {
            entity_type: 'Infrastructure',
          }),
      )
      .getMany();
  }

  async create(
    createInfrastructureDto: CreateInfrastructureDto,
  ): Promise<Infrastructure> {
    return await this.infrastructureRepository.save(createInfrastructureDto);
  }

  async show(infraId: number): Promise<Infrastructure | null> {
    return await this.infrastructureRepository
      .createQueryBuilder('infrastructures')
      .leftJoinAndSelect(
        'infrastructures.hldFiles',
        'hldFiles',
        'hldFiles.entity_type = :entity_type',
        {
          entity_type: 'Infrastructure',
        },
      )
      .leftJoinAndSelect(
        'infrastructures.infrastructureType',
        'infrastructureType',
      )
      .leftJoinAndSelect('infrastructures.pod', 'pod')
      .where('infrastructures.id = :id', { id: infraId })
      .getOne();
  }

  async update(
    id: number,
    updateInfrastructureDto: UpdateInfrastructureDto,
  ): Promise<UpdateResult> {
    return await this.infrastructureRepository.update(id, {
      name: updateInfrastructureDto.name,
      infrastructure_type_id: updateInfrastructureDto.infrastructure_type_id,
      pod_id: updateInfrastructureDto.pod_id,
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.infrastructureRepository.delete(id);
  }

  async deleteMultiple(
    deleteMultipleInfrastrucutreDto: DeleteMultipleInfrastrucutreDto,
  ): Promise<DeleteResult> {
    return await this.infrastructureRepository.delete(
      deleteMultipleInfrastrucutreDto.infrastructure_ids,
    );
  }
}
