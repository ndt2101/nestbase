import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { validate } from 'class-validator';
import { ImportRackToPodDto } from '../dto/importRackToPod.dto';

@Injectable()
export class ValidateRackPipe implements PipeTransform {
  async transform(file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];
      let data = xlsx.utils.sheet_to_json(workSheet, {
        header: 1,
        defval: null,
      });
      data = await Promise.all(
        data.map(async (record, index) => {
          if (index != 0) {
            const dtoObjects = new ImportRackToPodDto();
            dtoObjects.rack_name = record[1];

            const errors = await validate(dtoObjects);
            if (errors.length) {
              record[3] = errors
                .map((error) => Object.values(error.constraints))
                .flat()
                .join();
            } else {
              record[3] = null;
            }
          }

          return record;
        }),
      );
      return data;
    } catch (error) {
      throw new BadRequestException('Error processing file');
    }
  }
}
