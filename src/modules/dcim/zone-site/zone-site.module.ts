import { Module } from '@nestjs/common';
import { ZoneSiteController } from './zone-site.controller';
import { ZoneSiteService } from './zone-site.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { ZoneSite } from 'src/database/entities/postgre/ZoneSite.entity';
import { DB_CONNECTION } from '@common/constants/global.const';
import { ZoneSiteRepository } from './zone-site.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZoneSite], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([ZoneSiteRepository]),
  ],
  controllers: [ZoneSiteController],
  providers: [ZoneSiteService],
})
export class ZoneSiteModule {}
