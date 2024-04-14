import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure.controller';
import { InfrastructureService } from './infrastructure.service';
import { InfrastructureRepository } from './infrastructure.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { DB_CONNECTION } from '@common/constants/global.const';
import { Infrastructure } from 'src/database/entities/postgre/Infrastructure.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Infrastructure], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([InfrastructureRepository]),
  ],
  providers: [InfrastructureService],
  controllers: [InfrastructureController],
})
export class InfrastructureModule {}
