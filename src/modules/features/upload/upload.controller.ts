import {
  Controller,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Post,
  Body,
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from './upload.service';
import { UploadFileDto } from './dto/uploadFileDto.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // upload single file
  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.uploadService.uploadSingleFile(file, uploadFileDto);
  }

  // upload multiple file
  @Post('/multiple-files')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.uploadService.uploadMultipleFile(files, uploadFileDto);
  }
}
