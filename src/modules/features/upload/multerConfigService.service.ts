import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { destination, setFileName, imageFileFilter } from '../../../common/utils/file-upload.utils';
import {
    MulterOptionsFactory,
    MulterModuleOptions
} from '@nestjs/platform-express'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
        storage: diskStorage({
            destination: destination,
            filename: setFileName,
        }),
        limits: { 
            fileSize: 250 * 1048576 //250MB
        },
        fileFilter: imageFileFilter,
    };
  }
}