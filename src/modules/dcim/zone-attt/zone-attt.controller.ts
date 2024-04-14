import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ZoneAtttQueryDto } from './dto/zoneQueryAttt.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ZoneATTT } from 'src/database/entities/postgre/ZoneATTT.entity';
import { CreateZoneAtttDto } from './dto/createZoneAttt.dto';
import { ZoneAtttService } from './zone-attt.service';
import { UpdateZoneAtttDto } from './dto/updateZoneAttt.dto';
import { DeleteMultipleZoneAtttDto } from './dto/deleteMultipleZoneAttt.dto';
import { ContextInterceptor } from '@common/interceptors/context.interceptor';
import * as xlsx from 'xlsx';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImportZoneATTT } from './pipe/validateImportZoneAttt.pipe';

@Controller('zone-attts')
export class ZoneAtttController {
  constructor(private readonly zoneAtttService: ZoneAtttService) {}

  @Get('/')
  async index(
    @Query() zoneAtttQueryDto: ZoneAtttQueryDto,
  ): Promise<PaginationDto<ZoneATTT>> {
    return await this.zoneAtttService.getAll(zoneAtttQueryDto);
  }

  @Get('/export-zone-attts')
  async exportZoneAttts(
    @Query() zoneAtttQueryDto: ZoneAtttQueryDto,
    @Res() res: Response,
  ) {
    const listZoneSite =
      await this.zoneAtttService.exportZoneAtttData(zoneAtttQueryDto);
    const exportData = [];
    listZoneSite.forEach((zoneSite, index) => {
      const formatedData = [index + 1, zoneSite.name];
      exportData.push(formatedData);
    });
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(exportData);
    xlsx.utils.sheet_add_aoa(workSheet, [['STT', 'Zone site name']], {
      origin: 'A1',
    });
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
  async importZoneAttts(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const excelPipe = new ValidateImportZoneATTT();
    const validatedData = await excelPipe.transform(file);
    validatedData.shift();
    const importData =
      await this.zoneAtttService.importZoneAttts(validatedData);

    // insert value to new file
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(importData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [
        [
          'STT',
          'Name',
          'Zone group',
          'Security level',
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
  create(@Body() createZoneAtttDto: CreateZoneAtttDto): Promise<ZoneATTT> {
    return this.zoneAtttService.create(createZoneAtttDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneAtttService.show(+id);
  }

  @Put(':id')
  @UseInterceptors(ContextInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneAtttDto: UpdateZoneAtttDto,
  ) {
    return this.zoneAtttService.update(+id, updateZoneAtttDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.zoneAtttService.delete(+id);
  }

  @Post('/delete-multiple-zone-attts')
  async deleteMultiple(
    @Body() deleteMultipleZoneAtttDto: DeleteMultipleZoneAtttDto,
  ): Promise<DeleteResult> {
    return await this.zoneAtttService.deleteMultiple(deleteMultipleZoneAtttDto);
  }
}
