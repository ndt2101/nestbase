import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { Zone } from 'src/database/entities/postgre/Zone.entity';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { DB_CONNECTION } from '@common/constants/global.const';
import { ZoneRepository } from './zone.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Zone], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([ZoneRepository]),
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
})
export class ZoneModule {}
