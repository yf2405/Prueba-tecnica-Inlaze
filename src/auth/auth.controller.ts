import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Response } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { email, password, name } = createUserDto;

    try {
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      const userExists = await this.usersService.findByEmail(email);

      if (userExists) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "User already exists",
        });
      }

      const user = await this.usersService.createUser(email, password, name);

      // Generamos el payload y el token JWT
      const payload = { sub: user._id, email: user.email };
      const token = this.jwtService.sign(payload);

      // Establecemos la cookie con el token JWT
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Expira en 7 días
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "User created successfully",
        user: {
          ...user.toObject(),
          password: undefined, // No devolver el password en la respuesta
        },
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  // Nuevo endpoint para iniciar sesión (login)
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginDto);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }
  @Post("logout")
  async logout(@Res() res: Response) {
    try {
      // Eliminar la cookie del token
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Asegurarse de enviar la respuesta aquí mismo
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error during logout",
      });
    }
  }
}
