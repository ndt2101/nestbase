import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from 'src/database/entities/postgre/Site.entity';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { SiteRepository } from './site.repository';
import { DB_CONNECTION } from '@common/constants/global.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([Site], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([SiteRepository]),
  ],
  providers: [SiteService],
  controllers: [SiteController],
  exports: [TypeOrmModule, TypeOrmExModule],
})
export class SiteModule {}
