import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { validate } from 'class-validator';
import { CreateZoneDto } from '../dto/createZone.dto';

@Injectable()
export class ValidateImportZone implements PipeTransform {
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
            const dtoObjects = new CreateZoneDto();
            dtoObjects.name = record[1];
            dtoObjects.zone_id = record[2];
            dtoObjects.infrastructure_type_id = record[3];
            dtoObjects.zone_attt_id = record[4];
            dtoObjects.description = record[5];

            const errors = await validate(dtoObjects);
            if (errors.length) {
              record[6] = errors
                .map((error) => Object.values(error.constraints))
                .flat()
                .join();
            } else {
              record[6] = null;
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
