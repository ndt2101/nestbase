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
import { ZoneSiteService } from './zone-site.service';
import { ZoneSite } from 'src/database/entities/postgre/ZoneSite.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DeleteResult } from 'typeorm';
import { UpdateZoneSiteDto } from './dto/updateZoneSite.dto';
import { DeleteMultipleZoneSiteDto } from './dto/deleteMultipleZoneSite.dto';
import { CreateZoneSiteDto } from './dto/createZoneSite.dto';
import { ContextInterceptor } from '@common/interceptors/context.interceptor';
import * as xlsx from 'xlsx';
import { ZoneSiteQueryDto } from './dto/zoneQuerySite.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImportZoneSite } from './pipe/validateImportZoneSite.pipe';

@Controller('zone-sites')
export class ZoneSiteController {
  constructor(private readonly zoneSiteService: ZoneSiteService) {}

  @Get('/')
  async index(
    @Query() zoneSiteQueryDto: ZoneSiteQueryDto,
  ): Promise<PaginationDto<ZoneSite>> {
    return await this.zoneSiteService.getAll(zoneSiteQueryDto);
  }

  @Get('/export-zone-sites')
  async exportZoneSites(
    @Query() zoneSiteQueryDto: ZoneSiteQueryDto,
    @Res() res: Response,
  ) {
    const listZoneSite =
      await this.zoneSiteService.exportZoneSiteData(zoneSiteQueryDto);
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
  async importZoneSites(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const excelPipe = new ValidateImportZoneSite();
    const validatedData = await excelPipe.transform(file);
    validatedData.shift();
    const importData = await this.zoneSiteService.importZoneSites(validatedData);

    // insert value to new file
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(importData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [['STT', 'Zones site name', 'Description', 'Results']],
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
  create(@Body() createZoneSiteDto: CreateZoneSiteDto): Promise<ZoneSite> {
    return this.zoneSiteService.create(createZoneSiteDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneSiteService.show(+id);
  }

  @Put(':id')
  @UseInterceptors(ContextInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneSiteDto: UpdateZoneSiteDto,
  ) {
    return this.zoneSiteService.update(+id, updateZoneSiteDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.zoneSiteService.delete(+id);
  }

  @Post('/delete-multiple-zone-sites')
  async deleteMultiple(
    @Body() deleteMultipleZoneSiteDto: DeleteMultipleZoneSiteDto,
  ): Promise<DeleteResult> {
    return await this.zoneSiteService.deleteMultiple(deleteMultipleZoneSiteDto);
  }
}
