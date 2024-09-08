import { Controller, Post, Body, Res, HttpStatus, UseGuards, Request, Get } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Response } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt.strategy";

@Controller("auth")
export class AuthController {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post("signup")
  public async signup(
    @Body() createUserDto: CreateUserDto, 
    @Res() res: Response,
  ): Promise<Response> {
    const { email, password, name } = createUserDto;

    try {
      if (!email || !password || !name) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      const userExists = await this.usersService.findByEmail(email);
      if (userExists) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "User already exists",
        });
      }

      const user = await this.usersService.createUser(email, password, name);
      // Generar el payload y el token JWT
      const payload = { sub: user._id, email: user.email };
      const token = this.jwtService.sign(payload);

      // Establecer la cookie con el token JWT
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
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  @Post("login")
  public async login(
    @Body() loginDto: LoginDto, @Res() res: Response): Promise<Response> {
    try {
      const result = await this.authService.login(loginDto);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  @Post("logout")
  public logout(@Res() res: Response): Response {
    try {
      // Eliminar la cookie del token
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

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


@UseGuards(JwtAuthGuard)
@Get('me')
public async getMe(@Request() req, @Res() res: Response) {
  const user = req.user;  // Aquí obtienes el usuario del token JWT si es válido
  return res.status(200).json({
    success: true,
    user,  // Devuelve los datos del usuario al frontend
  });
}
}