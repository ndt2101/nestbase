import { Module } from '@nestjs/common';
import { ZoneAtttController } from './zone-attt.controller';
import { ZoneAtttService } from './zone-attt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZoneATTT } from 'src/database/entities/postgre/ZoneATTT.entity';
import { DB_CONNECTION } from '@common/constants/global.const';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { ZoneATTTRepository } from './zone-attt.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZoneATTT], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([ZoneATTTRepository]),
  ],
  controllers: [ZoneAtttController],
  providers: [ZoneAtttService]
})
export class ZoneAtttModule {}
