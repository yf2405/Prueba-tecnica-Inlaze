//import { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from "./dto/update-user.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { User } from "../schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createUser(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    });

    return user.save();
  }

  // Método para obtener un usuario por ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findByEmailWithPassword(email?: string) {
    return this.userModel.findOne({ email }).select("id name email password");
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find({ isDeleted: false }).exec(); // Solo obtener usuarios no eliminados
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const { password, ...updateFields } = updateUserDto;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields["password"] = hashedPassword;
    }

    return this.userModel.findByIdAndUpdate(userId, updateFields, { new: true }).exec();
  }

  // Otros métodos como findByEmail o createUser pueden estar aquí

  // Método para soft delete
  async softDelete(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.isDeleted = true; // Marcar como eliminado
    return user.save();
  }
}
