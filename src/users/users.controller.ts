import { Controller, Get, Param, Res, HttpStatus, Body, Put, Delete, UseGuards, Req, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Response } from "express";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "src/auth/jwt.strategy";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Obtener información de un usuario por su ID
  @Get(":id")
  async getUserById(@Param("id") id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
  }
  @Get()
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.usersService.getAllUsers();
      return res.status(HttpStatus.OK).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);

      if (!updatedUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User updated successfully",
        user: {
          ...updatedUser.toObject(),
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
  @Delete(":id")
  async softDeleteUser(@Param("id") id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.softDelete(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User soft deleted successfully",
        user,
      });
    } catch (error: any) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)  // Asegurarse de que el usuario esté autenticado
  @Post('like-movie/:movieId')
  async likeMovie(@Req() req, @Param('movieId') movieId: string) {
    const userId = req.user.userId;
    return this.usersService.toggleLikeMovie(userId, movieId);
  }
}

