import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000',  // Cambia esto al dominio de tu frontend
    credentials: true,  // Si estás utilizando cookies o autenticación
  });

  await app.listen(5000);
}

void bootstrap();