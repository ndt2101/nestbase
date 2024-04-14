import {
  Controller,
  Query,
  Get,
  Post,
  Body,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Infrastructure } from '../../../database/entities/postgre/Infrastructure.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { InfrastructureQueryDto } from './dto/infrastructureQuery.dto';
import { InfrastructureService } from './infrastructure.service';
import { CreateInfrastructureDto } from './dto/createInfrastructure.dto';
import { UpdateInfrastructureDto } from './dto/updateInfrastructure.dto';
import { DeleteResult } from 'typeorm';
import { ContextInterceptor } from '@common/interceptors/context.interceptor';
import { DeleteMultipleInfrastrucutreDto } from './dto/deleteMultipleInfrastructure.dto';
import * as xlsx from 'xlsx';
import { InfrastructureType } from '../../../database/entities/postgre/InfrastructureType.entity';
import { Response } from 'express';

@Controller('infrastructures')
export class InfrastructureController {
  constructor(private readonly infrastructureService: InfrastructureService) {}

  @Get('/')
  async index(
    @Query() infrastructureQueryDto: InfrastructureQueryDto,
  ): Promise<PaginationDto<Infrastructure>> {
    return await this.infrastructureService.getAll(infrastructureQueryDto);
  }

  @Get('/export-infrastructures')
  async exportInfrastructures(
    @Query() infrastructureQueryDto: InfrastructureQueryDto,
    @Res() res: Response,
  ) {
    const listPod = await this.infrastructureService.exportInfrastructureData(
      infrastructureQueryDto,
    );
    const exportData = [];
    listPod.forEach((infra, index) => {
      const formatedData = [
        index + 1,
        infra.name,
        infra.infrastructureType ? infra.infrastructureType.name : null,
        infra.pod ? infra.pod.name : null,
        infra.pod ? infra.pod.region_name : null,
        infra.pod ? infra.pod.site_name : null,
        infra.pod ? infra.pod.racks : null,
        infra.pod ? infra.pod.locations : null,
      ];
      exportData.push(formatedData);
    });
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(exportData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [
        [
          'STT',
          'Infra Name',
          'Infra type',
          'POD',
          'Region',
          'Site',
          'Number of racks',
          'Number of locations',
          'HLD status',
        ],
      ],
      {
        origin: 'A1',
      },
    );
    xlsx.utils.book_append_sheet(workBook, workSheet, 'sheet1');
    const buffer = xlsx.write(workBook, { type: 'buffer' });
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=validatedData.xlsx',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.send(buffer);
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<Infrastructure> {
    return this.infrastructureService.show(+id);
  }

  @Post('/')
  async store(
    @Body() createInfrastructureDto: CreateInfrastructureDto,
  ): Promise<Infrastructure> {
    return this.infrastructureService.create(createInfrastructureDto);
  }

  @Put(':id')
  @UseInterceptors(ContextInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInfrastructureDto: UpdateInfrastructureDto,
  ) {
    return await this.infrastructureService.update(
      +id,
      updateInfrastructureDto,
    );
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.infrastructureService.delete(+id);
  }

  @Post('/delete-multiple')
  async deleteMultiple(
    @Body() deleteMultipleInfrastrucutreDto: DeleteMultipleInfrastrucutreDto,
  ): Promise<DeleteResult> {
    return await this.infrastructureService.deleteMultiple(
      deleteMultipleInfrastrucutreDto,
    );
  }
}
