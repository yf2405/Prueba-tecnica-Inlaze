/*
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
  // Asegúrate de tener el esquema correcto
  // Servicio que envía el email
import { User } from 'src/schemas/user.schema';
import { sendWelcomeEmail } from './mailtrap/emails.';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async verifyEmail(code: string): Promise<{ success: boolean; message: string; user?: any }> {
    const user = await this.userModel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },  // Asegura que el token no esté expirado
    });

    if (!user) {
      return { success: false, message: 'Invalid or expired verification code' };
    }

    // Marcar al usuario como verificado
    user.isVerified = true;
    user.verificationToken = undefined;  // Eliminar el token
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Envía un email de bienvenida
    await sendWelcomeEmail(user.email, user.name);

    return {
      success: true,
      message: 'Email verified successfully',
      user: {
        ...user.toObject(),
        password: undefined,  // No enviar la contraseña
      },
    };
  }
}
  */