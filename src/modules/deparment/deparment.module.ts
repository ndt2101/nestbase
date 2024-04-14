import { Module } from '@nestjs/common';
import { DeparmentController } from './deparment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/database/entities/mariadb/Department.entity';
import { DepartmentService } from './department.service';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { DepartmentRepository } from './department.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    TypeOrmExModule.forCustomRepository([DepartmentRepository])
  ],
  controllers: [DeparmentController],
  providers: [DepartmentService],
  exports: [DepartmentService]
})
export class DeparmentModule {}
