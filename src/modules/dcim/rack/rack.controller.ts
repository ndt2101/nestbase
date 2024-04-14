import { Controller, Get, Query, Res } from '@nestjs/common';
import { Rack } from 'src/database/entities/postgre/Rack.entity';
import { RackQueryDto } from './dto/rackQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { RackService } from './rack.service';
import { Response } from 'express';
import * as xlsx from 'xlsx';

@Controller('racks')
export class RackController {
  constructor(private readonly rackService: RackService) {}

  @Get('/')
  async index(
    @Query() rackQueryDto: RackQueryDto,
  ): Promise<PaginationDto<Rack>> {
    return await this.rackService.getAll(rackQueryDto);
  }

  @Get('/get-rack-by-pod')
  async getRackByPod(
    @Query() rackQueryDto: RackQueryDto,
  ): Promise<PaginationDto<Rack>> {
    return await this.rackService.getRackByPod(rackQueryDto);
  }

  @Get('/export-rack-by-pod')
  async exportRackByPod(
    @Query() rackQueryDto: RackQueryDto,
    @Res() res: Response,
  ) {
    const listRacks = await this.rackService.exportRackByPodData(rackQueryDto);
    const exportData = [];
    listRacks.forEach((rack, index) => {
      const formatedData = [
        index + 1,
        rack.name,
        rack.location ? rack.location.name : null,
        rack.devices,
        0,
        0,
        0,
        0,
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
          'Rack name',
          'Location',
          'Number of device',
          'Maximum capacity',
          'Used capacity',
          'Total U',
          'Used U',
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
}
