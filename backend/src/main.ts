// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global middlewares / pipes / filters / interceptors
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(LoggerMiddleware);

  // Security middlewares
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: parseInt(process.env.THROTTLE_TTL) * 1000 || 60000,
      max: parseInt(process.env.THROTTLE_LIMIT) || 100,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
