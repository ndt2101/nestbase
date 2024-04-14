import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileUpload } from 'src/database/entities/postgre/FileUpload.entity';
import { DB_CONNECTION } from '@common/constants/global.const';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadRepository } from './file-upload.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileUpload], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([FileUploadRepository]),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
