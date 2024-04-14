import { Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/createZone.dto';
import { UpdateZoneDto } from './dto/updateZone.dto';
import { ZoneRepository } from './zone.repository';
import { ZoneQueryDto } from './dto/zoneQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Zone } from 'src/database/entities/postgre/Zone.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DB_CONNECTION } from '@common/constants/global.const';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { DeleteMultipleZoneDto } from './dto/deleteMultipleZone.dto';

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone, DB_CONNECTION.DCIM)
    private readonly zoneRepository: ZoneRepository,
    @InjectDataSource(DB_CONNECTION.DCIM)
    private readonly dataSource: DataSource,
  ) {}
  async getAll(zoneQueryDto: ZoneQueryDto): Promise<PaginationDto<Zone>> {
    const skipCount = (zoneQueryDto.page - 1) * zoneQueryDto.per_page;
    const query = this.zoneRepository
      .createQueryBuilder('zone')
      .leftJoinAndSelect('zone.infrastructureType', 'infrastructureType')
      .leftJoinAndSelect('zone.zoneATTT', 'zoneATTT');

    if (zoneQueryDto.filter) {
      query.where('zone.name LIKE :pattern', {
        pattern: `%${zoneQueryDto.filter}%`,
      });
    }

    if (zoneQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        zoneQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'zone.infrastructure_type_id IN (:...listInfrastructureTypeIds)',
        {
          listInfrastructureTypeIds: listInfrastructureTypeIds,
        },
      );
    }

    if (zoneQueryDto.zone_attt_id) {
      query.andWhere('zone.zone_attt_id = :zone_attt_id', {
        zone_attt_id: zoneQueryDto.zone_attt_id,
      });
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(zoneQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      zoneQueryDto.page,
      zoneQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async exportZoneData(zoneQueryDto: ZoneQueryDto): Promise<Zone[]> {
    const query = this.zoneRepository
      .createQueryBuilder('zone')
      .leftJoinAndSelect('zone.infrastructureType', 'infrastructureType')
      .leftJoinAndSelect('zone.zoneATTT', 'zoneATTT');

    if (zoneQueryDto.filter) {
      query.where('zone.name LIKE :pattern', {
        pattern: `%${zoneQueryDto.filter}%`,
      });
    }

    if (zoneQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        zoneQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'zone.infrastructure_type_id IN (:...listInfrastructureTypeIds)',
        {
          listInfrastructureTypeIds: listInfrastructureTypeIds,
        },
      );
    }

    if (zoneQueryDto.zone_attt_id) {
      query.andWhere('zone.zone_attt_id = :zone_attt_id', {
        zone_attt_id: zoneQueryDto.zone_attt_id,
      });
    }

    return await query.getMany();
  }

  async importZones(listZoneSiteName): Promise<[]> {
    const maxZoneIdData = await this.zoneRepository
      .createQueryBuilder('zone')
      .orderBy('zone.zone_id', 'DESC')
      .getOne();
    const dataInsert = [];
    const validatedData = listZoneSiteName.map((item, index) => {
      if (!item[6] && item[1]) {
        const data = {
          name: item[1],
          zone_id: item[2]
            ? item[2]
            : maxZoneIdData
              ? maxZoneIdData.zone_id + index + 1
              : index + 1,
          infrastructure_type_id: item[3],
          zone_attt_id: item[4],
          description: item[5],
        };
        dataInsert.push(data);
      } else if (!item[1]) {
        item[6] = 'Name is not empty';
      }

      return item;
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const zoneRepo = queryRunner.manager.getRepository(Zone);
    try {
      await zoneRepo.insert(dataInsert);

      return validatedData;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }

    return validatedData;
  }

  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    let maxZoneIdData = null;
    if (!createZoneDto.zone_id) {
      maxZoneIdData = await this.zoneRepository
        .createQueryBuilder('zone')
        .orderBy('zone.zone_id', 'DESC')
        .getOne();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const zoneRepo = queryRunner.manager.getRepository(Zone);
      const newZone = await zoneRepo.save({
        name: createZoneDto.name,
        infrastructure_type_id: createZoneDto.infrastructure_type_id,
        zone_id: createZoneDto.zone_id
          ? createZoneDto.zone_id
          : maxZoneIdData
            ? maxZoneIdData.zone_id + 1
            : 1,
        zone_attt_id: createZoneDto.zone_attt_id,
        description: createZoneDto.description,
      });
      await queryRunner.commitTransaction();

      return newZone;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async show(id: number): Promise<Zone | null> {
    return await this.zoneRepository
      .createQueryBuilder('zone')
      .leftJoinAndSelect('zone.infrastructureType', 'infrastructureType')
      .leftJoinAndSelect('zone.zoneATTT', 'zoneATTT')
      .where('zone.id = :id', { id: id })
      .getOne();
  }

  async update(
    id: number,
    updateZoneDto: UpdateZoneDto,
  ): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const zoneRepo = queryRunner.manager.getRepository(Zone);
      await zoneRepo.update(id, {
        name: updateZoneDto.name,
        infrastructure_type_id: updateZoneDto.infrastructure_type_id,
        zone_attt_id: updateZoneDto.zone_attt_id,
        description: updateZoneDto.description,
      });
      return;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.zoneRepository.delete(id);
  }

  async deleteMultiple(
    deleteMultipleZoneDto: DeleteMultipleZoneDto,
  ): Promise<DeleteResult> {
    return await this.zoneRepository.delete(deleteMultipleZoneDto.zone_ids);
  }
}
