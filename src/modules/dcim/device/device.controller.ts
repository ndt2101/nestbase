import { Controller, Get, Query, Res } from '@nestjs/common';
import { DeviceQueryDto } from './dto/deviceQuery.dto';
import { Device } from 'src/database/entities/postgre/Device.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DeviceService } from './device.service';
import { DeviceByPodQueryDto } from './dto/deviceByPodQuery.dto';
import { Response } from 'express';
import * as xlsx from 'xlsx';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('/')
  async index(
    @Query() deviceQueryDto: DeviceQueryDto,
  ): Promise<PaginationDto<Device>> {
    return await this.deviceService.getAll(deviceQueryDto);
  }

  @Get('/get-device-by-pod')
  async getDeviceByPod(
    @Query() deviceByPodQueryDto: DeviceByPodQueryDto,
  ): Promise<PaginationDto<Device>> {
    return await this.deviceService.getDeviceByPod(deviceByPodQueryDto);
  }

  @Get('/get-vpn-and-storage-device-by-pod')
  async getVpnAndStorageDeviceByPod(
    @Query() deviceByPodQueryDto: DeviceByPodQueryDto,
  ): Promise<PaginationDto<Device>> {
    return await this.deviceService.getVpnAndStorageDeviceByPod(
      deviceByPodQueryDto,
    );
  }

  @Get('/export-device-by-pod')
  async exportDeviceByPod(
    @Query() deviceByPodQueryDto: DeviceByPodQueryDto,
    @Res() res: Response,
  ) {
    const listLocation =
      await this.deviceService.exportDeviceByPod(deviceByPodQueryDto);
    const exportData = [];
    listLocation.forEach((device, index) => {
      const formatedData = [
        index + 1,
        device.location ? device.location.name : null,
        device.rack ? device.rack.name : null,
        this.deviceService.getDeviceType(device),
        device.name,
        this.deviceService.getDeviceIP(device),
      ];
      exportData.push(formatedData);
    });
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(exportData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [['STT', 'Locaiton', 'Rack', 'Type of device', 'name', 'IP']],
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

  @Get('/export-vpn-and-storage-device-by-pod')
  async exportVpnAndStorageDeviceByPod(
    @Query() deviceByPodQueryDto: DeviceByPodQueryDto,
    @Res() res: Response,
  ) {
    const listLocation =
      await this.deviceService.exportVpnAndStorageDeviceByPod(
        deviceByPodQueryDto,
      );
    const exportData = [];
    listLocation.forEach((device, index) => {
      const formatedData = [
        index + 1,
        device.location ? device.location.name : null,
        device.rack ? device.rack.name : null,
        this.deviceService.getDeviceType(device),
        device.name,
        this.deviceService.getDeviceIP(device),
      ];
      exportData.push(formatedData);
    });
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(exportData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [['STT', 'Locaiton', 'Rack', 'Type of device', 'name', 'IP']],
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
