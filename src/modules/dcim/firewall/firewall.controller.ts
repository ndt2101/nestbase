import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { FirewallQueryDto } from './dto/firewallQuery.dto';
import { Firewall } from 'src/database/entities/postgre/Firewall.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('firewalls')
export class FirewallController {
  constructor(private readonly firewallService: FirewallService) {}

  @Get('/')
  findAll(@Query() firewallQueryDto: FirewallQueryDto): Promise<PaginationDto<Firewall>> {
    return this.firewallService.findAll(firewallQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firewallService.show(+id);
  }

}
