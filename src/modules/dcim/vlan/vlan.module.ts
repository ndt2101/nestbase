import { Firewall } from 'src/database/entities/postgre/Firewall.entity';
import { Loadbalancer } from 'src/database/entities/postgre/Loadbalancer.entity';
import { Module } from '@nestjs/common';
import { VlanController } from './vlan.controller';
import { VlanService } from './vlan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { VlanRepository } from './vlan.repository';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import { Zone } from 'src/database/entities/postgre/Zone.entity';
import { DB_CONNECTION } from '@common/constants/global.const';
import { FirewallService } from '../firewall/firewall.service';
import { LoadBalancerService } from '../load-balancer/load-balancer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Vlan, Zone, Loadbalancer, Firewall],
      DB_CONNECTION.DCIM,
    ),
    TypeOrmExModule.forCustomRepository([VlanRepository]),
  ],
  controllers: [VlanController],
  providers: [VlanService, LoadBalancerService, FirewallService],
})
export class VlanModule {}
