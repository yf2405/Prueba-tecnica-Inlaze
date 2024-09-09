import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

// Define el controlador en el mismo archivo
@Controller()
class AppController {
  @Get()
  getHello(): string {
    return 'Hola Mundo!';
  }
}

// Define el módulo en el mismo archivo
@Module({
  controllers: [AppController],
})
class AppModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'prueba-tecnica-fronted-inlaze-6gde.vercel.app',
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
}

void bootstrap();