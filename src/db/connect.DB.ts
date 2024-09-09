import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import mongoose from "mongoose";

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  async connectDB() {
    const mongoURI = this.configService.get<string>('MONGO_URI');

    if (!mongoURI) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }

    try {
      const conn = await mongoose.connect(mongoURI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error:any) {
      console.log('Error connecting to MongoDB: ', error.message);
      process.exit(1); // 1 es fallo, 0 es éxito
    }
  }
}