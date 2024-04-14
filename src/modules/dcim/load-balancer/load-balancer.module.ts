import { Module } from '@nestjs/common';
import { LoadBalancerService } from './load-balancer.service';
import { LoadBalancerController } from './load-balancer.controller';
import { Loadbalancer } from 'src/database/entities/postgre/Loadbalancer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONNECTION } from '@common/constants/global.const';
import { Device } from 'src/database/entities/postgre/Device.entity';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { VlanRepository } from '../vlan/vlan.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device], DB_CONNECTION.DCIM),
    TypeOrmModule.forFeature([Loadbalancer], DB_CONNECTION.DCIM),
    TypeOrmModule.forFeature([Vlan], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([VlanRepository]),
  ],
  controllers: [LoadBalancerController],
  providers: [LoadBalancerService],
})
export class LoadBalancerModule {}
