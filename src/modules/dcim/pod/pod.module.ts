import { Module } from '@nestjs/common';
import { PodController } from './pod.controller';
import { PodService } from './pod.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { PodRepository } from './pod.repository';
import { Pod } from 'src/database/entities/postgre/Pod.entity';
import { RackModule } from '../rack/rack.module';
import { LocationModule } from '../location/location.module';
import { DB_CONNECTION } from '@common/constants/global.const';
import { SiteModule } from '../site/site.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pod], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([PodRepository]),
    RackModule,
    LocationModule,
    SiteModule,
  ],
  controllers: [PodController],
  providers: [PodService],
  exports: [TypeOrmModule, TypeOrmExModule],
})
export class PodModule {}
