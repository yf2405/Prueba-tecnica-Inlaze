import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy"; // Importa JwtStrategy
import { AuthService } from "./auth.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Registra la estrategia por defecto
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [ JwtStrategy, AuthService], // Asegúrate de incluir JwtStrategy en los providers
  exports: [JwtModule], // Exporta el JwtModule si lo necesitas en otros módulos
})
export class AuthModule {}