import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de configuración estén disponibles en toda la aplicación
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URI"), // Usa la variable de entorno o un valor por defecto
      }),
    }),
    UsersModule, // Importa el módulo de usuarios
    AuthModule, // Importa el módulo de autenticación
  ],
})
export class AppModule {}
