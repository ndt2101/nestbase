import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { urlencoded } from 'express';
import HttpLogInterceptor from './interceptors/http-log.interceptor';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { ValidationConfig } from './config/validation.config';
import { useContainer } from 'class-validator';
// import { ContextInterceptor } from '@common/interceptors/context.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/1.0');
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  // app.useGlobalInterceptors(new ContextInterceptor());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // app.use(json({ limit: process.env.LIMIT_REQUEST_BODY }));
  app.use(
    urlencoded({
      extended: true,
      limit: process.env.LIMIT_REQUEST_BODY || '1024kb',
    }),
  );
  app.enableCors();
  app.use(helmet());

  app.useGlobalInterceptors(new HttpLogInterceptor(new Reflector()));

  const PORT = process.env.PORT || 8000;
  await app.listen(PORT);
}
bootstrap();
