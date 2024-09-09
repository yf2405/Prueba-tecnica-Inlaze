import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
}

void bootstrap();