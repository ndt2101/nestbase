import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { NOT_TRIM_KEY } from './const.pipe';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private isStr(str: any): boolean {
    return typeof str === 'string' && str !== null;
  }

  private trim(values) {
    Object.keys(values).forEach((key) => {
      if (!NOT_TRIM_KEY.includes(key)) {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key]);
        } else if (this.isStr(values[key])) {
          values[key] = values[key].trim();
        }
      }
    });
    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    if (this.isObj(values)) {
      return this.trim(values);
    }
    if (this.isStr(values)) {
      return values.trim();
    }
    return values;
  }
}
