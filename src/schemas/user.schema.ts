import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'El campo no puede estar vacío.' } })
  email!: string;

  @Prop({ required: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'El campo no puede estar vacío.' } })
  password!: string;

  @Prop({ required: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'El campo no puede estar vacío.' } })
  name!: string;

  @Prop({ default: Date.now })
  lastLogin?: Date;

  @Prop({ default: false })
  isVerified?: boolean;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpiresAt?: Date;

  // Especifica el tipo explícitamente
  @Prop({ type: String, validate: { validator: (v: string) => v.trim().length > 0, message: 'El campo no puede estar vacío.' } })
  verificationToken?: string;  // No requerido
  @Prop({ type: Date, default: null })
  verificationTokenExpiresAt?: Date | null;

  @Prop({ type: [String], default: [] })
  likedMovies?: string[];

  @Prop({ default: false })
  isDeleted?: boolean; // Campo para soft delete
}

export const UserSchema = SchemaFactory.createForClass(User);
