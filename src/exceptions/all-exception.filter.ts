import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import AppLog from 'src/logger/loggers/app-log';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    try {
      message = exception?.status
        ? exception.getResponse().message
        : exception.message;
    } catch (err) {
      message = exception.message;
    }
    let exceptionContent = {};
    if (process.env.NODE_ENV === 'production') {
      exceptionContent = {
        statusCode: status,
        timestamp: new Date().toString(),
        success: false,
        message: message || '',
      };
    } else {
      exceptionContent = {
        statusCode: status,
        timestamp: new Date().toString(),
        path: request.url,
        method: request.method,
        success: false,
        stack: exception?.stack,
        message: message || '',
        body: request.body,
      };
    }
    AppLog.error(exceptionContent);
    response.status(status).json(exceptionContent);
  }
}
