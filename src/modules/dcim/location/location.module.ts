import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { Location } from 'src/database/entities/postgre/Location.entity';
import { LocationRepository } from './location.repository';
import { DB_CONNECTION } from '@common/constants/global.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([LocationRepository]),
  ],
  providers: [LocationService, LocationRepository],
  controllers: [LocationController],
  exports: [TypeOrmModule, TypeOrmExModule],
})
export class LocationModule {}
