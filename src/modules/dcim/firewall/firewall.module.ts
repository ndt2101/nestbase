import { Module } from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { FirewallController } from './firewall.controller';
import { FirewallRepository } from './firewall.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { DB_CONNECTION } from '@common/constants/global.const';
import { Firewall } from 'src/database/entities/postgre/Firewall.entity';
import { Device } from 'src/database/entities/postgre/Device.entity';
import { Vlan } from 'src/database/entities/postgre/Vlan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device], DB_CONNECTION.DCIM),
    TypeOrmModule.forFeature([Firewall], DB_CONNECTION.DCIM),
    TypeOrmModule.forFeature([Vlan], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([FirewallRepository]),
  ],
  controllers: [FirewallController],
  providers: [FirewallService],
})
export class FirewallModule {}
