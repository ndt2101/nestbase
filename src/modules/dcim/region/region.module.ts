import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from 'src/database/entities/postgre/Region.entity';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { RegionRepository } from './region.repository';
import { DB_CONNECTION } from '@common/constants/global.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([Region], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([RegionRepository])
  ],
  providers: [RegionService],
  controllers: [RegionController]
})
export class RegionModule {}
