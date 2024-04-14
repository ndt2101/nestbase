import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Firewall } from 'src/database/entities/postgre/Firewall.entity';
import { FirewallRepository } from './firewall.repository';
import { DB_CONNECTION } from '@common/constants/global.const';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import { VlanRepository } from '../vlan/vlan.repository';
import { PaginationDto } from '@common/dto/pagination.dto';
import { FirewallQueryDto } from './dto/firewallQuery.dto';

@Injectable()
export class FirewallService {
  constructor(
    @InjectRepository(Vlan, DB_CONNECTION.DCIM)
    private readonly vlanRepository: VlanRepository,
    @InjectRepository(Firewall, DB_CONNECTION.DCIM)
    private readonly firewallRepository: FirewallRepository,
  ) {}

  async findAll(
    firewallQueryDto: FirewallQueryDto,
  ): Promise<PaginationDto<Firewall>> {
    const skipCount = (firewallQueryDto.page - 1) * firewallQueryDto.per_page;
    const query = this.firewallRepository
      .createQueryBuilder('dcim_firewall')
      .leftJoin('dcim_firewall.devices', 'devices')
      .leftJoin('devices.ip_address', 'ip_address')
      .addSelect('devices.id')
      .addSelect('devices.name')
      .addSelect('devices.serial')
      .addSelect('ip_address.address')
      .where('devices.firewall_id IS NOT NULL');

    if (firewallQueryDto.filter) {
      query.andWhere('dcim_firewall.name LIKE :pattern', {
        pattern: `%${firewallQueryDto.filter}%`,
      });
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(firewallQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      firewallQueryDto.page,
      firewallQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async show(id: number): Promise<Firewall | null> {
    const firewall = await this.firewallRepository
      .createQueryBuilder('firewall')
      .leftJoin('firewall.devices', 'devices')
      .leftJoin('devices.ip_address', 'ip_address')
      .addSelect('devices.id')
      .addSelect('devices.name')
      .addSelect('devices.serial')
      .addSelect('ip_address.address')
      .where('firewall.id = :id', { id })
      .getOne();
    return firewall;
  }

  async showFirewallOfVlan(vlanId: number): Promise<Firewall[]> {
    const vlan = await this.vlanRepository
      .createQueryBuilder('vlan')
      .where('vlan.id = :vlanId', { vlanId })
      .getOne();
    return [];
    // if (vlan && vlan.firewall_ids) {
    //   const firewallIds = vlan.firewall_ids.split(',').map(id => parseInt(id.trim(), 10));
    //   const validFirewallIds = firewallIds.filter(id => !isNaN(id));
    //   const firewalls = await this.firewallRepository
    //     .createQueryBuilder('firewall')
    //     .leftJoin('firewall.devices', 'devices')
    //     .leftJoin('devices.ip_address', 'ip_address')
    //     .addSelect('devices.id')
    //     .addSelect('devices.name')
    //     .addSelect('devices.serial')
    //     .addSelect('ip_address.address')
    //     .whereInIds(validFirewallIds)
    //     .getMany();
    //   return firewalls;
    // } else {
    //   return [];
    // }
  }
}
