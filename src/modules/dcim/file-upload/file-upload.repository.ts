import { CustomRepository } from '@common/decorators/typeorm-ex.decorator';
import { FileUpload } from 'src/database/entities/postgre/FileUpload.entity';
import { Repository } from 'typeorm';

@CustomRepository(FileUpload)
export class FileUploadRepository extends Repository<FileUpload> {}
