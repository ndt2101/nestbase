import { Controller, Get, Param, ParseIntPipe, Query, Res } from '@nestjs/common';
import { FileQueryDto } from './dto/fileQuery.dto';
import { FileUpload } from 'src/database/entities/postgre/FileUpload.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { FileUploadService } from './file-upload.service';
import { Response } from 'express';

@Controller('file-uploads')
export class FileUploadController {
	constructor(private readonly fileUploadService: FileUploadService) {}
  @Get('')
  async index(@Query() fileQueryDto: FileQueryDto): Promise<PaginationDto<FileUpload>> {
    return await this.fileUploadService.getAll(fileQueryDto);
  }

  @Get('/:id/preview')
  async preview(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
		// return await this.fileUploadService.preview(id);
    const filePath = await this.fileUploadService.preview(id);
		console.log('111111111111', filePath)
		res.send({statusCode: 200, data: filePath})
  }
}
