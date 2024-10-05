import { Controller, Post, Body, Res, HttpStatus, UseGuards, Get, Req,  } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Response } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt.strategy";
import * as bcrypt from "bcryptjs";
import { cookieOptions } from "./cookieIotions";
import { AuthService } from "./auth.service";
import { User } from "src/schemas/user.schema";
//import { sendVerificationEmail } from "./mailtrap/emails.";

interface Request {
  user?: User; // Aquí defines que `req.user` es del tipo `User`
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  @Post('signup')
public async signup(
  @Body() createUserDto: CreateUserDto, 
  @Res() res: Response,
): Promise<Response> {
  const { email, password, name } = createUserDto;

  try {
    if (!email || !password || !name) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'User already exists',
      });
    }

    const user = await this.usersService.createUser(email, password, name);
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    res.cookie('authToken', token, cookieOptions);

   // const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: (error as Error).message,
    });
  }
}
@Post('login')
async login(@Body() loginDto: LoginDto,  @Res() res: Response,) {
  const { email, password } = loginDto;

  try {
    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Buscar al usuario por su email junto con la contraseña
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Crear el payload y generar el token
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Establecer el token en las cookies
    res.cookie('authToken', token, cookieOptions);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: (error as Error).message,
    });
  }
}
  @Post('logout')
  public logout(@Res() res: Response): Response {
    try {
      // Usar cookieOptions importado para limpiar la cookie
      res.clearCookie('authToken', cookieOptions);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error during logout',
      });
    }
  }


  @Post('verify-email')
  async verifyEmail(
    @Body('code') code: string,
    @Res() res: Response
  ) {
    try {
      const { success, message, user } = await this.authService.verifyEmail(code);
      return res.status(HttpStatus.OK).json({ success, message, user });
    } catch (error:any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  @Get('checkAuth')
  @UseGuards(JwtAuthGuard)
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user; // Aquí debe estar el usuario validado
  
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'User not found',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}  