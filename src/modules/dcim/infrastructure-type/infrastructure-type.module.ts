import { Module } from '@nestjs/common';
import { InfrastructureTypeController } from './infrastructure-type.controller';
import { InfrastructureTypeService } from './infrastructure-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureType } from 'src/database/entities/postgre/InfrastructureType.entity';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { InfrastructureTypeRepository } from './infrastructure-type.repository';
import { DB_CONNECTION } from '@common/constants/global.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([InfrastructureType], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([InfrastructureTypeRepository]),
  ],
  controllers: [InfrastructureTypeController],
  providers: [InfrastructureTypeService],
})
export class InfrastructureTypeModule {}
