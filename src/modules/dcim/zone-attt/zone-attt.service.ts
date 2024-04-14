import { DB_CONNECTION } from '@common/constants/global.const';
import { Injectable } from '@nestjs/common';
import { ZoneATTT } from 'src/database/entities/postgre/ZoneATTT.entity';
import { ZoneATTTRepository } from './zone-attt.repository';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ZoneAtttQueryDto } from './dto/zoneQueryAttt.dto';
import { UpdateZoneAtttDto } from './dto/updateZoneAttt.dto';
import { DeleteMultipleZoneAtttDto } from './dto/deleteMultipleZoneAttt.dto';
import { CreateZoneAtttDto } from './dto/createZoneAttt.dto';

@Injectable()
export class ZoneAtttService {
  constructor(
    @InjectRepository(ZoneATTT, DB_CONNECTION.DCIM)
    private readonly zoneAtttRepository: ZoneATTTRepository,
    @InjectDataSource(DB_CONNECTION.DCIM)
    private readonly dataSource: DataSource,
  ) {}
  async getAll(
    zoneAtttQueryDto: ZoneAtttQueryDto,
  ): Promise<PaginationDto<ZoneATTT>> {
    const skipCount = (zoneAtttQueryDto.page - 1) * zoneAtttQueryDto.per_page;
    const query = this.zoneAtttRepository.createQueryBuilder('zone_attt');

    if (zoneAtttQueryDto.filter) {
      query.where('zone_attt.zone_name LIKE :pattern', {
        pattern: `%${zoneAtttQueryDto.filter}%`,
      });
    }

    if (zoneAtttQueryDto.zone_groups) {
      const listZoneGroups = zoneAtttQueryDto.zone_groups.split(',');
      query.andWhere('zone_attt.zone_group IN (:...listZoneGroups)', {
        listZoneGroups: listZoneGroups,
      });
    }

    if (zoneAtttQueryDto.security_levels) {
      const listSecurityLevels = zoneAtttQueryDto.security_levels.split(',');
      query.andWhere('zone_attt.security_level IN (:...listSecurityLevels)', {
        listSecurityLevels: listSecurityLevels,
      });
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(zoneAtttQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      zoneAtttQueryDto.page,
      zoneAtttQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async exportZoneAtttData(
    zoneAtttQueryDto: ZoneAtttQueryDto,
  ): Promise<ZoneATTT[]> {
    const query = this.zoneAtttRepository.createQueryBuilder('zone_attt');

    if (zoneAtttQueryDto.filter) {
      query.where('zone_attt.name LIKE :pattern', {
        pattern: `%${zoneAtttQueryDto.filter}%`,
      });
    }

    return await query.getMany();
  }

  async importZoneAttts(listZoneSiteName): Promise<[]> {
    const dataInsert = [];
    const validatedData = listZoneSiteName.map((item) => {
      if (!item[5] && item[1]) {
        const data = {
          name: item[1],
          zone_group: item[2],
          security_level: item[3],
          description: item[4],
        };
        dataInsert.push(data);
      } else if (!item[1]) {
        item[5] = 'Name is not empty'
      }

      return item
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const zoneAtttRepo = queryRunner.manager.getRepository(ZoneATTT);
    try {
      await zoneAtttRepo.insert(dataInsert);

      return validatedData;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }

    return validatedData;
  }

  async create(createZoneAtttDto: CreateZoneAtttDto): Promise<ZoneATTT> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const zoneRepo = queryRunner.manager.getRepository(ZoneATTT);
      const newZone = await zoneRepo.save({
        name: createZoneAtttDto.name,
        zone_group: createZoneAtttDto.zone_group,
        security_level: createZoneAtttDto.security_level,
        description: createZoneAtttDto.description,
      });
      await queryRunner.commitTransaction();

      return newZone;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async show(id: number): Promise<ZoneATTT | null> {
    return await this.zoneAtttRepository
      .createQueryBuilder('zone_attt')
      .where('zone_attt.id = :id', { id: id })
      .getOne();
  }

  async update(
    id: number,
    updateAtttZoneDto: UpdateZoneAtttDto,
  ): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const zoneAtttRepo = queryRunner.manager.getRepository(ZoneATTT);
      await zoneAtttRepo.update(id, {
        name: updateAtttZoneDto.name,
        zone_group: updateAtttZoneDto.zone_group,
        security_level: updateAtttZoneDto.security_level,
        description: updateAtttZoneDto.description,
      });
      return;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.zoneAtttRepository.delete(id);
  }

  async deleteMultiple(
    deleteMultipleZoneAtttDto: DeleteMultipleZoneAtttDto,
  ): Promise<DeleteResult> {
    return await this.zoneAtttRepository.delete(
      deleteMultipleZoneAtttDto.zone_attt_ids,
    );
  }
}
