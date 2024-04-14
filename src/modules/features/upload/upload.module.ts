import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multerConfigService.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '@common/modules/typeorm-ex.module';
import { FileUpload } from 'src/database/entities/postgre/FileUpload.entity';
import { DB_CONNECTION } from '@common/constants/global.const';
import { FileUploadRepository } from './upload.repository';
import { ValidateFileUploadHLDMiddleware } from 'src/middlewares/uploadFile/validateFileUploadHLD.middleware';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    TypeOrmModule.forFeature([FileUpload], DB_CONNECTION.DCIM),
    TypeOrmExModule.forCustomRepository([FileUploadRepository]),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateFileUploadHLDMiddleware)
      .forRoutes({ path: 'upload/multiple-files', method: RequestMethod.POST });
  }
}
