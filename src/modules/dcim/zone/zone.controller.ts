import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
  UseInterceptors,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/createZone.dto';
import { UpdateZoneDto } from './dto/updateZone.dto';
import { ZoneQueryDto } from './dto/zoneQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Zone } from 'src/database/entities/postgre/Zone.entity';
import { DeleteMultipleZoneDto } from './dto/deleteMultipleZone.dto';
import { DeleteResult } from 'typeorm';
import { ContextInterceptor } from '@common/interceptors/context.interceptor';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImportZone } from './pipe/validateImportZone.pipe';
import * as xlsx from 'xlsx';

@Controller('zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Get('/')
  async index(
    @Query() zoneQueryDto: ZoneQueryDto,
  ): Promise<PaginationDto<Zone>> {
    return await this.zoneService.getAll(zoneQueryDto);
  }

  @Get('/export-zones')
  async exportZones(@Query() zoneQueryDto: ZoneQueryDto, @Res() res: Response) {
    const listZones = await this.zoneService.exportZoneData(zoneQueryDto);
    const exportData = [];
    listZones.forEach((zone, index) => {
      const formatedData = [
        index + 1,
        zone.name,
        zone.zone_id,
        zone.infrastructureType ? zone.infrastructureType.name : null,
        zone.zoneATTT ? zone.zoneATTT.name : null,
        zone.zoneATTT ? zone.zoneATTT.zone_group : null,
        zone.description,
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
          'Name',
          'ZoneID',
          'Infrastructure type',
          'Zone ATTT',
          'Zone group',
          'description',
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

  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  async importZoneSites(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const excelPipe = new ValidateImportZone();
    const validatedData = await excelPipe.transform(file);
    validatedData.shift();
    const importData = await this.zoneService.importZones(validatedData);

    // insert value to new file
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(importData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [
        [
          'STT',
          'Name',
          'Zone ID',
          'Infrastructure type id',
          'Zone ATTT id',
          'Description',
          'Results',
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

  @Post()
  create(@Body() createZoneDto: CreateZoneDto): Promise<Zone> {
    return this.zoneService.create(createZoneDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.show(+id);
  }

  @Put(':id')
  @UseInterceptors(ContextInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.update(+id, updateZoneDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.zoneService.delete(+id);
  }

  @Post('/delete-multiple-zones')
  async deleteMultiple(
    @Body() deleteMultipleZoneDto: DeleteMultipleZoneDto,
  ): Promise<DeleteResult> {
    return await this.zoneService.deleteMultiple(deleteMultipleZoneDto);
  }
}
