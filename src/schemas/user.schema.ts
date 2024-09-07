import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email?: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ required: true })
  name?: string;

  @Prop({ default: Date.now })
  lastLogin?: Date;

  @Prop({ default: false })
  isVerified?: boolean;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpiresAt?: Date;

  @Prop()
  verificationToken?: string;

  @Prop()
  verificationTokenExpiresAt?: Date;

  @Prop({ type: [String], default: [] })
  likedMovies?: string[];

  @Prop({ default: false })
  isDeleted?: boolean; // Campo para soft delete
}

export const UserSchema = SchemaFactory.createForClass(User);
