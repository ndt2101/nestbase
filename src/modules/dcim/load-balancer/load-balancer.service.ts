import { Injectable } from '@nestjs/common';
import { Loadbalancer } from 'src/database/entities/postgre/Loadbalancer.entity';
import { LoadbalancerRepository } from './load-balancer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DB_CONNECTION } from '@common/constants/global.const';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import { VlanRepository } from '../vlan/vlan.repository';
import { PaginationDto } from '@common/dto/pagination.dto';
import { LoadbalancerQueryDto } from './dto/loadbalancerQuery.dto';

@Injectable()
export class LoadBalancerService {
  constructor(
    @InjectRepository(Vlan, DB_CONNECTION.DCIM)
    private readonly vlanRepository: VlanRepository,
    @InjectRepository(Loadbalancer, DB_CONNECTION.DCIM)
    private readonly loadbalancerRepository: LoadbalancerRepository,
  ) {}

  async findAll(
    loadbalancerQueryDto: LoadbalancerQueryDto,
  ): Promise<PaginationDto<Loadbalancer>> {
    const skipCount =
      (loadbalancerQueryDto.page - 1) * loadbalancerQueryDto.per_page;
    const query = this.loadbalancerRepository
      .createQueryBuilder('dcim_loadbalancer')
      .leftJoin('dcim_loadbalancer.devices', 'devices')
      .leftJoin('devices.ip_address', 'ip_address')
      .addSelect('devices.id')
      .addSelect('devices.name')
      .addSelect('devices.serial')
      .addSelect('ip_address.address')
      .where('devices.load_balancer_id IS NOT NULL');

    if (loadbalancerQueryDto.filter) {
      query.andWhere('dcim_loadbalancer.name LIKE :pattern', {
        pattern: `%${loadbalancerQueryDto.filter}%`,
      });
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(loadbalancerQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      loadbalancerQueryDto.page,
      loadbalancerQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async show(id: number): Promise<Loadbalancer | null> {
    const loadbalancer = await this.loadbalancerRepository
      .createQueryBuilder('loadbalancer')
      .leftJoin('loadbalancer.devices', 'devices')
      .leftJoin('devices.ip_address', 'ip_address')
      .addSelect('devices.id')
      .addSelect('devices.name')
      .addSelect('devices.serial')
      .addSelect('ip_address.address')
      .where('loadbalancer.id = :id', { id })
      .getOne();
    return loadbalancer;
  }

  async showLoabalancerOfVlan(vlanId: number): Promise<Loadbalancer[]> {
    const vlan = await this.vlanRepository
      .createQueryBuilder('vlan')
      .where('vlan.id = :vlanId', { vlanId })
      .getOne();
    return [];
    // if (vlan && vlan.loadbalancer_ids) {
    //   const loadbalancerIds = vlan.loadbalancer_ids.split(',').map(id => parseInt(id.trim(), 10));

    //   const validLoadbalancerIds = loadbalancerIds.filter(id => !isNaN(id));

    //   const loadbalancers = await this.loadbalancerRepository
    //   .createQueryBuilder('loadbalancer')
    //   .leftJoin('loadbalancer.devices', 'devices')
    //   .leftJoin('devices.ip_address', 'ip_address')
    //   .addSelect('devices.id')
    //   .addSelect('devices.name')
    //   .addSelect('devices.serial')
    //   .addSelect('ip_address.address')
    //   .whereInIds(validLoadbalancerIds)
    //   .getMany();

    //   return loadbalancers;
    // } else {
    //   return [];
    // }
  }
}
