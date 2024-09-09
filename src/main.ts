import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Habilitar CORS
  app.enableCors({
    origin: 'prueba-tecnica-fronted-inlaze-6gde.vercel.app',  // Cambia esto al dominio de tu frontend
    credentials: true,  // Si estás utilizando cookies o autenticación
  });

  await app.listen(5000);
}

void bootstrap();