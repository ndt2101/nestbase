import { PaginationDto } from '@common/dto/pagination.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { Region } from 'src/database/entities/postgre/Region.entity';
import { RegionService } from './region.service';
import { RegionQueryDto } from './dto/regionQuery.dto';

@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('/')
  async index(
    @Query() regionQueryDto: RegionQueryDto,
  ): Promise<PaginationDto<Region>> {
    return await this.regionService.getAll(regionQueryDto);
  }
}
