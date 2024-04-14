import { Firewall } from 'src/database/entities/postgre/Firewall.entity';
import { Loadbalancer } from './../../../database/entities/postgre/Loadbalancer.entity';
import { Injectable, ParseIntPipe } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  ILike,
  UpdateResult,
  LessThanOrEqual,
  In,
  DeleteResult,
} from 'typeorm';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import { Zone } from 'src/database/entities/postgre/Zone.entity';
import { Device } from 'src/database/entities/postgre/Device.entity';
import { ZoneSite } from 'src/database/entities/postgre/ZoneSite.entity';
import { DB_CONNECTION } from '@common/constants/global.const';
import { CreateVlanDto } from './dto/createVlan.dto';
import { UpdateVlanDto } from './dto/updateVlan.dto';
import { VlanRepository } from './vlan.repository';
import { ZoneRepository } from '../zone/zone.repository';
import { FirewallRepository } from '../firewall/firewall.repository';
import { LoadbalancerRepository } from '../load-balancer/load-balancer.repository';
import { VlanQueryDto } from './dto/vlanQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { VlanLoadbalancer } from 'src/database/entities/postgre/VlanLoadbalancer.entity';
import { VlanFirewall } from 'src/database/entities/postgre/VlanFirewall.entity';
import { DeleteMultipleVlanDto } from './dto/deleteMultipleVlan.dto';

@Injectable()
export class VlanService {
  constructor(
    @InjectRepository(Vlan, DB_CONNECTION.DCIM)
    private readonly vlanRepository: VlanRepository,
    @InjectRepository(Zone, DB_CONNECTION.DCIM)
    private readonly zoneRepository: ZoneRepository,
    @InjectRepository(Firewall, DB_CONNECTION.DCIM)
    private readonly firewallRepository: FirewallRepository,
    @InjectRepository(Loadbalancer, DB_CONNECTION.DCIM)
    private readonly loadbalancerRepository: LoadbalancerRepository,
    @InjectDataSource(DB_CONNECTION.DCIM)
    private readonly dataSource: DataSource,
  ) {}

  async getAll(vlanQueryDto: VlanQueryDto): Promise<PaginationDto<Vlan>> {
    const skipCount = (vlanQueryDto.page - 1) * vlanQueryDto.per_page;
    const query = this.vlanRepository
      .createQueryBuilder('vlan')
      .leftJoin('vlan.zone', 'zone')
      .leftJoin('vlan.zoneSite', 'zoneSite')
      .leftJoin('vlan.infrastructureType', 'infrastructureType')
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.zone_id',
        'zoneSite.id',
        'zoneSite.name',
      ])
      .addSelect(['infrastructureType.id', 'infrastructureType.name']);

    if (vlanQueryDto.filter) {
      query.where('vlan.vlan_name LIKE :pattern', {
        pattern: `%${vlanQueryDto.filter}%`,
      });
    }

    if (vlanQueryDto.zone_site_ids) {
      const listZoneSiteIds = vlanQueryDto.zone_site_ids.split(',');
      query.andWhere('vlan.zone_site_id IN (:...zone_site_ids)', {
        zone_site_ids: listZoneSiteIds,
      });
    }

    if (vlanQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        vlanQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'vlan.infrastructure_type_id IN (:...infrastructure_type_ids)',
        {
          infrastructure_type_ids: listInfrastructureTypeIds,
        },
      );
    }

    if (vlanQueryDto.zone_uu_ids) {
      const listZoneUuIds = vlanQueryDto.zone_uu_ids.split(',');
      query.andWhere('vlan.zone_uu_id IN (:...zone_uu_ids)', {
        zone_uu_ids: listZoneUuIds,
      });
    }

    if (vlanQueryDto.subnet) {
      query.andWhere('vlan.subnet LIKE :subnet', {
        subnet: `%${vlanQueryDto.subnet}%`,
      });
    }

    if (vlanQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        vlanQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'vlan.infrastructure_type_id IN (:...listInfrastructureTypeIds)',
        {
          listInfrastructureTypeIds: listInfrastructureTypeIds,
        },
      );
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(vlanQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      vlanQueryDto.page,
      vlanQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async exportVlanData(vlanQueryDto: VlanQueryDto): Promise<Vlan[]> {
    const query = this.vlanRepository
      .createQueryBuilder('vlan')
      .leftJoin('vlan.zone', 'zone')
      .leftJoin('vlan.zoneSite', 'zoneSite')
      .leftJoin('vlan.infrastructureType', 'infrastructureType')
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.zone_id',
        'zoneSite.id',
        'zoneSite.name',
      ])
      .addSelect(['infrastructureType.id', 'infrastructureType.name']);

    if (vlanQueryDto.filter) {
      query.where('vlan.vlan_name LIKE :pattern', {
        pattern: `%${vlanQueryDto.filter}%`,
      });
    }

    if (vlanQueryDto.zone_site_ids) {
      const listZoneSiteIds = vlanQueryDto.zone_site_ids.split(',');
      query.andWhere('vlan.zone_site_id IN (:...zone_site_ids)', {
        zone_site_ids: listZoneSiteIds,
      });
    }

    if (vlanQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        vlanQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'vlan.infrastructure_type_id IN (:...infrastructure_type_ids)',
        {
          infrastructure_type_ids: listInfrastructureTypeIds,
        },
      );
    }

    if (vlanQueryDto.zone_uu_ids) {
      const listZoneUuIds = vlanQueryDto.zone_uu_ids.split(',');
      query.andWhere('vlan.zone_uu_id IN (:...zone_uu_ids)', {
        zone_uu_ids: listZoneUuIds,
      });
    }

    if (vlanQueryDto.subnet) {
      query.andWhere('vlan.subnet LIKE :subnet', {
        subnet: `%${vlanQueryDto.subnet}%`,
      });
    }

    if (vlanQueryDto.infrastructure_type_ids) {
      const listInfrastructureTypeIds =
        vlanQueryDto.infrastructure_type_ids.split(',');
      query.andWhere(
        'vlan.infrastructure_type_id IN (:...listInfrastructureTypeIds)',
        {
          listInfrastructureTypeIds: listInfrastructureTypeIds,
        },
      );
    }

    return await query.getMany();
  }

  async importVlans(listVlanData): Promise<[]> {
    const dataInsert = [];
    const validatedData = listVlanData.map((item, index) => {
      if (!item.error) {
        const data = {
          vlan_id: item.vlan_id,
          vlan_name: item.vlan_name,
          subnet: item.subnet,
          gw: item.gw,
          infrastructure_type_id: item.infrastructure_type_id,
          vxlan_id: item.vxlan_id,
          vlan_id_l3: item.vlan_id_l3,
          vxlan_id_l3: item.vxlan_id_l3,
          vrf: item.vrf,
          zone_uu_id: item.zone_uu_id,
          zone_site_id: item.zone_site_id,
          ip_type: item.ip_type,
          range_ip: item.range_ip,
          system: item.system,
          purpose: item.purpose,
          description: item.description,
        };
        dataInsert.push(data);
      }

      return [
        index + 1,
        item.infrastructure_type_id,
        item.zone_site_id,
        item.zone_uu_id,
        item.ip_type,
        item.subnet,
        item.range_ip,
        item.description,
        item.system,
        item.purpose,
        item.error,
      ];
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const vlanRepo = queryRunner.manager.getRepository(Vlan);
    try {
      await vlanRepo.insert(dataInsert);

      return validatedData;
    } catch (err) {
      throw err;
    } finally {
      await queryRunner.release();
    }

    return validatedData;
  }

  async show(vlanId: number): Promise<Vlan> {
    return await this.vlanRepository
      .createQueryBuilder('vlan')
      .leftJoin('vlan.zoneSite', 'zoneSite')
      .leftJoin('vlan.zone', 'zone')
      .leftJoin('vlan.infrastructureType', 'infrastructureType')
      .leftJoin('vlan.firewalls', 'firewall')
      .leftJoin('firewall.devices', 'deviceFW')
      .leftJoin('deviceFW.ip_address', 'ip_address_fw')
      .leftJoin('vlan.loadBalancers', 'loadBalancer')
      .leftJoin('loadBalancer.devices', 'deviceLB')
      .leftJoinAndSelect('deviceLB.ip_address', 'ip_address_LB')
      .addSelect([
        'zone.id',
        'zone.name',
        'zoneSite.id',
        'zoneSite.name',
        'infrastructureType.id',
        'infrastructureType.name',
      ])
      .addSelect([
        'firewall.id',
        'firewall.name',
        'deviceFW.id',
        'deviceFW.name',
        'deviceFW.firewall_id',
        'deviceFW.primary_ip4_id',
        'ip_address_fw.address',
      ])
      .addSelect([
        'loadBalancer.id',
        'loadBalancer.name',
        'deviceLB.id',
        'deviceLB.name',
        'deviceLB.load_balancer_id',
        'deviceLB.primary_ip4_id',
        'ip_address_LB.address',
      ])
      .where('vlan.id = :vlanId', { vlanId })
      .getOne();
  }

  async create(createVlanDto: CreateVlanDto): Promise<Vlan> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const vlanRepo = queryRunner.manager.getRepository(Vlan);
      const vlanLoadbalancerRepo =
        queryRunner.manager.getRepository(VlanLoadbalancer);
      const vlanFirewallRepo = queryRunner.manager.getRepository(VlanFirewall);

      const newVlan = await vlanRepo.save({
        vlan_id: createVlanDto.vlan_id,
        vlan_name: createVlanDto.vlan_name,
        subnet: createVlanDto.subnet,
        gw: createVlanDto.gw,
        infrastructure_type_id: createVlanDto.infrastructure_type_id,
        vxlan_id: createVlanDto.vxlan_id,
        vlan_id_l3: createVlanDto.vlan_id_l3,
        vxlan_id_l3: createVlanDto.vxlan_id_l3,
        vrf: createVlanDto.vrf,
        zone_uu_id: createVlanDto.zone_uu_id,
        zone_site_id: createVlanDto.zone_site_id,
        ip_type: createVlanDto.ip_type,
        range_ip: createVlanDto.range_ip,
        system: createVlanDto.system,
        purpose: createVlanDto.purpose,
        description: createVlanDto.description,
      });
      const dataInsertVlanLB = [];
      if (createVlanDto.loadbalancer_ids.length) {
        createVlanDto.loadbalancer_ids.forEach((lb_id) => {
          dataInsertVlanLB.push({
            vlan_id: newVlan.id,
            loadbalancer_id: lb_id,
          });
        });
      }

      const dataInsertVlanFW = [];
      if (createVlanDto.firewall_ids.length) {
        createVlanDto.firewall_ids.forEach((fw_id) => {
          dataInsertVlanFW.push({
            vlan_id: newVlan.id,
            firewall_id: fw_id,
          });
        });
      }

      await Promise.all([
        vlanLoadbalancerRepo.insert(dataInsertVlanLB),
        vlanFirewallRepo.insert(dataInsertVlanFW),
      ]);
      await queryRunner.commitTransaction();

      return newVlan;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err; // Rethrow the error for handling in the controller
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    updateVlanDto: UpdateVlanDto,
  ): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const vlanRepo = queryRunner.manager.getRepository(Vlan);
      const vlanLoadbalancerRepo =
        queryRunner.manager.getRepository(VlanLoadbalancer);
      const vlanFirewallRepo = queryRunner.manager.getRepository(VlanFirewall);

      await vlanRepo.update(id, {
        description: updateVlanDto.description,
        subnet: updateVlanDto.subnet,
      });
      const dataInsertVlanLB = [];
      if (updateVlanDto.loadbalancer_ids.length) {
        updateVlanDto.loadbalancer_ids.forEach((lb_id) => {
          dataInsertVlanLB.push({
            vlan_id: id,
            loadbalancer_id: lb_id,
          });
        });
      }

      const dataInsertVlanFW = [];
      if (updateVlanDto.firewall_ids.length) {
        updateVlanDto.firewall_ids.forEach((fw_id) => {
          dataInsertVlanFW.push({
            vlan_id: id,
            firewall_id: fw_id,
          });
        });
      }
      await Promise.all([
        vlanLoadbalancerRepo
          .createQueryBuilder()
          .delete()
          .from(VlanLoadbalancer)
          .where('vlan_id = :id', { id: id })
          .execute(),
        vlanFirewallRepo
          .createQueryBuilder()
          .delete()
          .from(VlanFirewall)
          .where('vlan_id = :id', { id: id })
          .execute(),
      ]);
      await Promise.all([
        vlanLoadbalancerRepo.insert(dataInsertVlanLB),
        vlanFirewallRepo.insert(dataInsertVlanFW),
      ]);

      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<void> {
    await this.vlanRepository.delete(id);
  }

  async getZoneByInfrastructureTypeId(
    infrastructureTypeId: number,
  ): Promise<Zone[]> {
    try {
      const zones = await this.zoneRepository
        .createQueryBuilder('zone')
        .leftJoin('zone.infrastructureType', 'infrastructureType')
        .where('infrastructureType.id = :infrastructureTypeId', {
          infrastructureTypeId,
        })
        .getMany();

      return zones;
    } catch (error) {
      // Handle errors appropriately
      throw error;
    }
  }

  calculateGateway(subnet: string): string {
    const [ipAddress, cidr] = subnet.split('/');
    const octets = ipAddress.split('.').map(Number);
    const networkBits = parseInt(cidr);
    const hostBits = 32 - networkBits;
    const lastOctet = octets[3] + Math.pow(2, hostBits) - 2;
    return `${octets[0]}.${octets[1]}.${octets[2]}.${lastOctet}`;
  }

  async deleteMultiple(
    deleteMultipleVlanDto: DeleteMultipleVlanDto,
  ): Promise<DeleteResult> {
    return await this.vlanRepository.delete(deleteMultipleVlanDto.vlan_ids);
  }
}
