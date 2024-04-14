import { Injectable } from '@nestjs/common';

@Injectable()
export default class BaseController {
  success(result: any, message?: string, code?: number) {
    return {
      result,
      message,
      code,
    };
  }
}
