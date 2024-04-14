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
import { PodService } from './pod.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Pod } from 'src/database/entities/postgre/Pod.entity';
import { PodQueryDto } from './dto/podQuery.dto';
import { CreatePodDto } from './dto/createPod.dto';
import { UpdatePodDto } from './dto/updatePod.dto';
import { DeleteResult } from 'typeorm';
import { ContextInterceptor } from '@common/interceptors/context.interceptor';
import { LocationToPodDto } from './dto/locationToPod.dto';
import { RackToPodDto } from './dto/rackToPod.dto';
import { DeleteMultiplePodDto } from './dto/deleteMultiplePod.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { ValidateLocationPipe } from 'src/modules/dcim/pod/pipe/validateLocation.pipe';
import * as xlsx from 'xlsx';
import { ValidateRackPipe } from './pipe/validateRack.pipe';

@Controller('pods')
export class PodController {
  constructor(private readonly podService: PodService) {}

  @Get('/')
  async index(@Query() podQueryDto: PodQueryDto): Promise<PaginationDto<Pod>> {
    return await this.podService.getAll(podQueryDto);
  }

  @Get('/export-pods')
  async exportPods(@Query() podQueryDto: PodQueryDto, @Res() res: Response) {
    const listPod = await this.podService.exportPodData(podQueryDto);
    const exportData = [];
    listPod.forEach((pod, index) => {
      const formatedData = [
        index + 1,
        pod.name,
        pod.infrastructureType ? pod.infrastructureType.name : null,
        pod.region_name,
        pod.site_name,
        pod.racks,
        pod.locations,
      ];
      exportData.push(formatedData)
    });
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(exportData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [
        [
          'STT',
          'POD Name',
          'Infrastructure type',
          'Region',
          'Site',
          'Number of racks',
          'Number of Locations',
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

  @Post('/')
  async store(@Body() createPodDto: CreatePodDto): Promise<Pod> {
    return this.podService.create(createPodDto);
  }

  @Post('/:id/import-locations')
  @UseInterceptors(FileInterceptor('file'))
  async importLocations(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const excelPipe = new ValidateLocationPipe();
    const validatedData = await excelPipe.transform(file);
    validatedData.shift();
    const importData = await this.podService.importLocationToPod(
      id,
      validatedData,
    );

    // insert value to new file
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(importData);
    xlsx.utils.sheet_add_aoa(workSheet, [['STT', 'Location name', 'Results']], {
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

  @Post('/:id/import-racks')
  @UseInterceptors(FileInterceptor('file'))
  async importRacks(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const excelPipe = new ValidateRackPipe();
    const validatedData = await excelPipe.transform(file);
    validatedData.shift();
    const importData = await this.podService.importRackToPod(id, validatedData);

    // insert value to new file
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(importData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [['STT', 'Rack name', 'Location name', 'Results']],
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

  @Post('/:id/add-locations')
  async addLocationToPod(
    @Param('id', ParseIntPipe) id: number,
    @Body() locationToPodDto: LocationToPodDto,
  ) {
    return await this.podService.addLocationToPod(id, locationToPodDto);
  }

  @Post('/:id/add-racks')
  async addRackToPod(
    @Param('id', ParseIntPipe) id: number,
    @Body() rackToPodDto: RackToPodDto,
  ) {
    return await this.podService.addRackToPod(id, rackToPodDto);
  }

  @Post('/:id/remove-racks')
  async removeRack(
    @Param('id', ParseIntPipe) id: number,
    @Body() rackToPodDto: RackToPodDto,
  ) {
    return await this.podService.removeRack(id, rackToPodDto);
  }

  @Post('/:id/remove-locations')
  async removeLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() locationToPodDto: LocationToPodDto,
  ) {
    return await this.podService.removeLocation(id, locationToPodDto);
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number): Promise<Pod> {
    return this.podService.show(+id);
  }

  @Put(':id')
  @UseInterceptors(ContextInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePodDto: UpdatePodDto,
  ) {
    // delete createPodDto['context'];
    return await this.podService.update(+id, updatePodDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.podService.delete(+id);
  }

  @Post('/delete-multiple-pod')
  async deleteMultiple(
    @Body() deleteMultiplePodDto: DeleteMultiplePodDto,
  ): Promise<DeleteResult> {
    return await this.podService.deleteMultiple(deleteMultiplePodDto);
  }
}
