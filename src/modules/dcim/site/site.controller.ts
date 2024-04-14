import { Controller, Get, Query } from '@nestjs/common';
import { Site } from 'src/database/entities/postgre/Site.entity';
import { SiteQueryDto } from './dto/siteQuery.dto';
import { SiteService } from './site.service';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('/')
  async index(
    @Query() siteQueryDto: SiteQueryDto,
  ): Promise<PaginationDto<Site>> {
    return await this.siteService.getAll(siteQueryDto);
  }
}
