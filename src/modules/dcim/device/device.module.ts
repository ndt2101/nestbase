import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { DeviceRepository } from './device.repository';
import { DB_CONNECTION } from '@common/constants/global.const';
import { Device } from 'src/database/entities/postgre/Device.entity';
import { PodModule } from '../pod/pod.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([DeviceRepository]),
    PodModule
  ],
  providers: [DeviceService, DeviceRepository],
  controllers: [DeviceController]
})
export class DeviceModule {}
