import { PaginationDto } from '@common/dto/pagination.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { InfrastructureType } from 'src/database/entities/postgre/InfrastructureType.entity';
import { InfrastructureTypeQueryDto } from './dto/infrastructureTypeQuery.dto';
import { InfrastructureTypeService } from './infrastructure-type.service';

@Controller('infrastructure-types')
export class InfrastructureTypeController {
  constructor(
    private readonly infrastructureTypeService: InfrastructureTypeService,
  ) {}

  @Get('/')
  async index(
    @Query() infrastructureTypeQueryDto: InfrastructureTypeQueryDto,
  ): Promise<PaginationDto<InfrastructureType>> {
    return await this.infrastructureTypeService.getAll(
      infrastructureTypeQueryDto,
    );
  }
}
