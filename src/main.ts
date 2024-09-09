import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'https://prueba-tecnica-fronted-inlaze-6gde-fslejln6m-yf2405s-projects.vercel.app', // Incluye el esquema y asegúrate que sea el dominio correcto
  credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
}

void bootstrap();