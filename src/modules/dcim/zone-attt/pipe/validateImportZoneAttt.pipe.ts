import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { validate } from 'class-validator';
import { CreateZoneAtttDto } from '../dto/createZoneAttt.dto';

@Injectable()
export class ValidateImportZoneATTT implements PipeTransform {
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
            const dtoObjects = new CreateZoneAtttDto();
            dtoObjects.name = record[1];
            dtoObjects.zone_group = record[2];
            dtoObjects.security_level = record[3];
            dtoObjects.description = record[4];

            const errors = await validate(dtoObjects);
            if (errors.length) {
              record[5] = errors
                .map((error) => Object.values(error.constraints))
                .flat()
                .join();
            } else {
              record[2] = null;
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
