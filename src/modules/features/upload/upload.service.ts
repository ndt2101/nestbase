import { Injectable } from '@nestjs/common';
import { minioClient } from '../../../common/utils/storageDriver.utils';
import * as fs from 'fs';
import { UploadFileDto } from './dto/uploadFileDto.dto';
import { FileUpload } from 'src/database/entities/postgre/FileUpload.entity';
import { DB_CONNECTION } from '@common/constants/global.const';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadRepository } from './upload.repository';
import { InsertResult } from 'typeorm';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(FileUpload, DB_CONNECTION.DCIM)
    private readonly fileUploadRepository: FileUploadRepository,
  ) {}

  async uploadSingleFile(
    file: Express.Multer.File,
    uploadFileDto?: UploadFileDto,
  ): Promise<boolean> {
    const folderName = uploadFileDto.folder_name
      ? uploadFileDto.folder_name
      : file.fieldname;
    await this.uploadToMinio(file, `${folderName}/${file.filename}`);

    return true;
  }

  async uploadMultipleFile(
    files: Array<Express.Multer.File>,
    uploadFileDto?: UploadFileDto,
  ): Promise<InsertResult> {
    const dataInsert = [];
    files.forEach(async (file) => {
      const path = uploadFileDto.folder_name
        ? uploadFileDto.folder_name + '/' + file.filename
        : file.originalname + '/' + file.filename;
      const data = {
        name: file.originalname,
        formated_name: file.filename,
        extension: file.originalname.split('.').pop(),
        mimetype: file.mimetype,
        driver: 'minio',
        path: path,
        url: path,
        size: file.size,
        folder_name: uploadFileDto.folder_name,
        entity_type: uploadFileDto.entity_type,
        entity_id: uploadFileDto.entity_id
      }
      dataInsert.push(data)
      const folderName = uploadFileDto.folder_name
        ? uploadFileDto.folder_name
        : file.fieldname;
      await this.uploadToMinio(file, `${folderName}/${file.filename}`);
    });

    return await this.fileUploadRepository.insert(dataInsert)
  }

  uploadToMinio(file: Express.Multer.File, folderName: string) {
    const metaData = {
      'Content-Type': 'application/octet-stream',
    };
    minioClient.bucketExists(
      process.env.MINIO_DEFAULT_BUCKET,
      function (error, exists) {
        if (error) {
          return new Error('Upload failed!');
        }
        if (exists) {
          minioClient.fPutObject(
            process.env.MINIO_DEFAULT_BUCKET,
            folderName,
            file.path,
            metaData,
            function (err) {
              if (err) {
                return new Error('Failed!');
              } else {
                fs.rmSync(file.path, { recursive: true, force: true });
              }
            },
          );
        } else {
          minioClient.makeBucket(
            process.env.MINIO_DEFAULT_BUCKET,
            process.env.MINIO_REGION,
            function (err) {
              if (err) return new Error('Upload failed!');
              minioClient.fPutObject(
                process.env.MINIO_DEFAULT_BUCKET,
                folderName,
                file.path,
                metaData,
                function (err) {
                  if (err) {
                    return new Error('Upload failed!');
                  } else {
                    fs.rmSync(file.path, { recursive: true, force: true });
                  }
                },
              );
            },
          );
        }
      },
    );
  }
}
