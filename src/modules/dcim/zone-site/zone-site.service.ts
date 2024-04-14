import { DB_CONNECTION } from '@common/constants/global.const';
import { Injectable } from '@nestjs/common';
import { ZoneSite } from 'src/database/entities/postgre/ZoneSite.entity';
import { ZoneSiteRepository } from './zone-site.repository';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ZoneSiteQueryDto } from './dto/zoneQuerySite.dto';
import { CreateZoneSiteDto } from './dto/createZoneSite.dto';
import { UpdateZoneSiteDto } from './dto/updateZoneSite.dto';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { DeleteMultipleZoneSiteDto } from './dto/deleteMultipleZoneSite.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ZoneSiteService {
  constructor(
    @InjectRepository(ZoneSite, DB_CONNECTION.DCIM)
    private readonly zoneSiteRepository: ZoneSiteRepository,
    @InjectDataSource(DB_CONNECTION.DCIM)
    private readonly dataSource: DataSource,
  ) {}
  async getAll(
    zoneSiteQueryDto: ZoneSiteQueryDto,
  ): Promise<PaginationDto<ZoneSite>> {
    const skipCount = (zoneSiteQueryDto.page - 1) * zoneSiteQueryDto.per_page;
    const query = this.zoneSiteRepository.createQueryBuilder('zone_site');

    if (zoneSiteQueryDto.filter) {
      query.where('zone_site.name LIKE :pattern', {
        pattern: `%${zoneSiteQueryDto.filter}%`,
      });
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(zoneSiteQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      zoneSiteQueryDto.page,
      zoneSiteQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async exportZoneSiteData(
    zoneSiteQueryDto: ZoneSiteQueryDto,
  ): Promise<ZoneSite[]> {
    const query = this.zoneSiteRepository.createQueryBuilder('zone_site');

    if (zoneSiteQueryDto.filter) {
      query.where('zone_site.name LIKE :pattern', {
        pattern: `%${zoneSiteQueryDto.filter}%`,
      });
    }

    return await query.getMany();
  }

  async importZoneSites(listZoneSiteName): Promise<[]> {
    const dataInsert = [];
    const validatedData = listZoneSiteName.map((item) => {
      if (!item[3] && item[1]) {
        const data = {
          name: item[1],
          description: item[2],
        };
        dataInsert.push(data);
      } else if (!item[1]) {
        item[3] = 'Name is not empty'
      }

      return item
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const zoneSiteRepo = queryRunner.manager.getRepository(ZoneSite);
    try {
      await zoneSiteRepo.insert(dataInsert);

      return validatedData;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }

    return validatedData;
  }

  async create(createZoneSiteDto: CreateZoneSiteDto): Promise<ZoneSite> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const zoneSiteRepo = queryRunner.manager.getRepository(ZoneSite);
      const newZone = await zoneSiteRepo.save({
        name: createZoneSiteDto.name,
        description: createZoneSiteDto.description,
      });

      return newZone;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async show(id: number): Promise<ZoneSite | null> {
    return await this.zoneSiteRepository
      .createQueryBuilder('zone_site')
      .where('zone_site.id = :id', { id: id })
      .getOne();
  }

  async update(
    id: number,
    updateZoneSiteDto: UpdateZoneSiteDto,
  ): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const zoneSiteRepo = queryRunner.manager.getRepository(ZoneSite);
      await zoneSiteRepo.update(id, {
        name: updateZoneSiteDto.name,
        description: updateZoneSiteDto.description,
      });
      return;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.zoneSiteRepository.delete(id);
  }

  async deleteMultiple(
    deleteMultipleZoneSiteDto: DeleteMultipleZoneSiteDto,
  ): Promise<DeleteResult> {
    return await this.zoneSiteRepository.delete(
      deleteMultipleZoneSiteDto.zone_site_ids,
    );
  }
}
