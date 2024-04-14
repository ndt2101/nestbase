import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import * as fs from 'fs';

@Injectable()
export class ValidateFileUploadHLDMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    const maxSize = 600 * 1024 * 1024;
    multer({
      storage: multer.diskStorage({
        destination: (req, file, callback) => {
          if (!fs.existsSync(`${process.cwd()}/public/uploads/IT/HLD`)) {
            fs.mkdirSync(`${process.cwd()}/public/uploads/IT/HLD`, {
              recursive: true,
            });
          }
          callback(null, `${process.cwd()}/public/uploads/IT/HLD`);
        },
        filename: (req, file, callback) => {
          callback(
            null,
            `${this.generateRandomString(64)}.${file.originalname
              .split('.')
              .pop()}`,
          );
        },
      }),
      limits: { fileSize: maxSize, files: 5 },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          callback(new Error('only pdf file are allowed!'));
        }
        callback(null, true);
      },
    }).fields([{ name: 'files', maxCount: 5 }])

    next()
  }

  generateRandomString(myLength) {
    const chars =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    const randomArray = Array.from(
      { length: myLength },
      () => chars[Math.floor(Math.random() * chars.length)],
    );
    const randomString = randomArray.join('');

    return randomString;
  }
}
