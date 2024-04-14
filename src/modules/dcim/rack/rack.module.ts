import { Module } from '@nestjs/common';
import { RackService } from './rack.service';
import { RackController } from './rack.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { RackRepository } from './rack.repository';
import { Rack } from 'src/database/entities/postgre/Rack.entity';
import { DB_CONNECTION } from '@common/constants/global.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rack], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([RackRepository]),
  ],
  providers: [RackService, RackRepository],
  controllers: [RackController],
  exports: [TypeOrmModule, TypeOrmExModule],
})
export class RackModule {}
