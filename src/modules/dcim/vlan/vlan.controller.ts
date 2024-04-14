import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  ParseIntPipe,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { VlanService } from './vlan.service';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import { Zone } from 'src/database/entities/postgre/Zone.entity';
import { CreateVlanDto } from './dto/createVlan.dto';
import { UpdateVlanDto } from './dto/updateVlan.dto';
import { VlanQueryDto } from './dto/vlanQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { FirewallService } from '../firewall/firewall.service';
import { Firewall } from '../../../database/entities/postgre/Firewall.entity';
import { LoadBalancerService } from '../load-balancer/load-balancer.service';
import { Loadbalancer } from 'src/database/entities/postgre/Loadbalancer.entity';
import { ModifyPayloadInterceptor } from './interceptor/modifyPayload.interceptor';
import { ContextInterceptor } from '@common/interceptors/context.interceptor';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import * as xlsx from 'xlsx';
import { Response } from 'express';
import { ValidateImportVlan } from './pipe/validateImportVlan.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteMultipleVlanDto } from './dto/deleteMultipleVlan.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DB_CONNECTION } from '@common/constants/global.const';

@Controller('vlans')
export class VlanController {
  constructor(
    private readonly vlanService: VlanService,
    private readonly firewallService: FirewallService,
    private readonly loadbalancerService: LoadBalancerService,
    @InjectEntityManager(DB_CONNECTION.DCIM)
    private readonly entityManager: EntityManager,
  ) {}

  @Get('/')
  async findAll(
    @Query() vlanQueryDto: VlanQueryDto,
  ): Promise<PaginationDto<Vlan>> {
    return this.vlanService.getAll(vlanQueryDto);
  }

  @Get('/export-vlans')
  async exportZones(@Query() vlanQueryDto: VlanQueryDto, @Res() res: Response) {
    const listVlans = await this.vlanService.exportVlanData(vlanQueryDto);
    const exportData = [];
    listVlans.forEach((vlan, index) => {
      const formatedData = [
        index + 1,
        vlan.vlan_name,
        vlan.subnet,
        vlan.ip_status,
        vlan.vlan_id,
        vlan.vxlan_id,
        vlan.vlan_id_l3,
        vlan.vxlan_id_l3,
        vlan.vrf,
        vlan.zone ? vlan.zone.name : null,
        vlan.zoneSite ? vlan.zoneSite.name : null,
        vlan.infrastructureType ? vlan.infrastructureType.name : null
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
          'Vlan name',
          'Subnet',
          'Ip status',
          'Vlan id',
          'Vxlan id',
          'Vlan id l3',
          'Vxlan id l3',
          'vrf',
          'Zone name',
          'Zone site name',
          'Infrastructure type',
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
  async importVlans(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const excelPipe = new ValidateImportVlan(this.entityManager);
    const validatedData = await excelPipe.transform(file);
    validatedData.shift();
    const importData = await this.vlanService.importVlans(validatedData);

    // insert value to new file
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(importData);
    xlsx.utils.sheet_add_aoa(
      workSheet,
      [
        [
          'STT',
          'Infrastructure id',
          'Zone site id',
          'Zone uu id',
          'Ip type',
          'subnet',
          'Range id',
          'Description',
          'System',
          'Purpose',
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

  @Get(':id')
  async show(@Param('id') id: number): Promise<Vlan | null> {
    return this.vlanService.show(id);
  }

  @Post()
  @UseInterceptors(ModifyPayloadInterceptor)
  async create(@Body() createVlanDto: CreateVlanDto): Promise<Vlan> {
    return this.vlanService.create(createVlanDto);
  }

  @Put(':id')
  @UseInterceptors(ContextInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVlanDto: UpdateVlanDto,
  ): Promise<UpdateResult> {
    return await this.vlanService.update(id, updateVlanDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.vlanService.delete(id);
  }

  @Get('/get-zone-from-infrastructure-type/:id')
  async getZoneFromInfrastructureType(
    @Param('id') id: number,
  ): Promise<Zone[] | null> {
    return this.vlanService.getZoneByInfrastructureTypeId(id);
  }

  @Get(':id/firewalls')
  async getFirewallsByVlanId(@Param('id') vlanId: number): Promise<Firewall[]> {
    return this.firewallService.showFirewallOfVlan(vlanId);
  }

  @Get(':id/loadbalancers')
  async getLoadBalancersByVlanId(
    @Param('id') vlanId: number,
  ): Promise<Loadbalancer[]> {
    return this.loadbalancerService.showLoabalancerOfVlan(vlanId);
  }

  @Post('/delete-multiple-vlans')
  async deleteMultiple(
    @Body() deleteMultipleVlanDto: DeleteMultipleVlanDto,
  ): Promise<DeleteResult> {
    return await this.vlanService.deleteMultiple(deleteMultipleVlanDto);
  }
}
