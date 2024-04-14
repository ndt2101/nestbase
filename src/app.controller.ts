import { Controller, Get, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express'
import { AppService } from './app.service';
import { BadRequestException } from '@nestjs/common'

import AppLog from './logger/loggers/app-log'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test/success')
  getTestSuccess() : object {
    AppLog.info('Will Succeed')
    
    return {
      success: true,
      code: 200,
      message: '',
      data: [],
      meta: {},
    }
  }


  @Get('/test/error')
  getTestError(@Res() res : Response) : object {
    AppLog.warn('Will Fail')

    return res.status(404).json({
      success: false,
      code: 404,
      message: 'Not found',
      data: [],
      meta: {},
    })
  }

  @Get('/test/throw')
  getTestThrow(@Res() res : Response) : object {
    AppLog.error('Will Throw')
    // HttpLogInterceptor cannot intercept this one
    throw new BadRequestException('Error 400')
  }
}
