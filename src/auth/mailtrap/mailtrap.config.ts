/*
import { MailtrapClient } from "mailtrap";
import * as dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN ?? "",  // Cargar desde el archivo .env
});

export const sender = {
  email: "yersoncorrea278@gmail.com",
  name: "yerdev",
};

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: `<p>Your verification code is: ${verificationToken}</p>`,
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error:any) {
    console.error(`Error sending verification`, error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};
*/