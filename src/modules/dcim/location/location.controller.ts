import { Controller, Get, Query, Res } from '@nestjs/common';
import { LocationQueryDto } from './dto/locationQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Location } from 'src/database/entities/postgre/Location.entity';
import { LocationService } from './location.service';
import * as xlsx from 'xlsx';
import { Response } from 'express';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/')
  async index(
    @Query() locationQueryDto: LocationQueryDto,
  ): Promise<PaginationDto<Location>> {
    return await this.locationService.getAll(locationQueryDto);
  }

  @Get('/get-location-by-pod')
  async getLocationByPod(
    @Query() locationQueryDto: LocationQueryDto,
  ): Promise<PaginationDto<Location>> {
    return await this.locationService.getLocationByPod(locationQueryDto);
  }

  @Get('/export-location-by-pod')
  async exportLocationByPod(
    @Query() locationQueryDto: LocationQueryDto,
    @Res() res: Response,
  ) {
    const listLocation =
      await this.locationService.exportLocationByPodData(locationQueryDto);
    const exportData = [];
    listLocation.forEach((location, index) => {
      const formatedData = [
        index + 1,
        location.name,
        location.pod.region_name,
        location.pod.site_name,
        location.racks,
      ];
      exportData.push(formatedData);
    });
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(exportData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [['STT', 'Locaiton name', 'Region', 'Site', 'Number of racks']],
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
