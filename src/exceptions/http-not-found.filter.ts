import { HttpException, HttpStatus } from '@nestjs/common';

export class HTTPNotFoundException extends HttpException {
  constructor(response: string) {
    super(response, HttpStatus.NOT_FOUND);
  }
}
