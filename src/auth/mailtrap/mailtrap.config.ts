import * as nodemailer from 'nodemailer'; // Importación correcta
import * as dotenv from 'dotenv';

dotenv.config();

// Configuración del transporte de Nodemailer con Gmail
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yersonstuardlittle062@gmail.com', // Tu correo de Gmail
    pass: 'cmmx wemy dwfz msii ', // Contraseña o App Password
  },
});

export const sender = {
  email: 'hello@yersoncorrea.com',
  name: 'YerDev',
};
