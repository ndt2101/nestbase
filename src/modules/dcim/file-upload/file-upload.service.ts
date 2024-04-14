import { DB_CONNECTION } from '@common/constants/global.const';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'src/database/entities/postgre/FileUpload.entity';
import { FileQueryDto } from './dto/fileQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { FileUploadRepository } from './file-upload.repository';
import { minioClient } from '@common/utils/storageDriver.utils';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload, DB_CONNECTION.DCIM)
    private readonly fileUploadRepository: FileUploadRepository,
  ) {}

  async getAll(fileQueryDto: FileQueryDto): Promise<PaginationDto<FileUpload>> {
    const skipCount = (fileQueryDto.page - 1) * fileQueryDto.per_page;
    const query = this.fileUploadRepository.createQueryBuilder('file_uploads');

    if (fileQueryDto.filter) {
      query.andWhere('file_uploads.name LIKE :pattern', {
        pattern: `%${fileQueryDto.filter}%`,
      });
    }

    if (fileQueryDto.entity_id) {
      query.andWhere('file_uploads.entity_id = :entity_id', {
        entity_id: fileQueryDto.entity_id,
      });
    }

    if (fileQueryDto.entity_type) {
      query.andWhere('file_uploads.entity_type = :entity_type', {
        entity_type: fileQueryDto.entity_type,
      });
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(fileQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      fileQueryDto.page,
      fileQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async preview(id: number): Promise<string> {
    const file = await this.fileUploadRepository.findOne({
      where: { id: id },
    });

    if (file) {
      let a = await minioClient.fGetObject(
        process.env.MINIO_DEFAULT_BUCKET,
        file.path,
        `${process.cwd()}/public/tempotary/${file.folder_name}/${file.name}`,
        // function (err) {
        //   if (err) {
        //     console.log('xxxxxxxxxxxxx');
        //     return 'Xem tài liệu thất bại!';
        //   } else {
        //     console.log('yyyyyyyyyyyyyyyyyy');
        //     return `tempotary/${file.folder_name}/${file.name}`;
        //   }
        // },
      );
			return `tempotary/${file.folder_name}/${file.name}`;
			// console.log('ssssssssss', a)
    } else {
      console.log('hhhhhhhhhhhhhhhhh');
      return 'Tài liệu không tồn tại!';
    }
  }
}
