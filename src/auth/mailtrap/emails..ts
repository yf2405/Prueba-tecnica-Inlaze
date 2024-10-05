
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { transporter, sender  } from "./mailtrap.config.js";


// Función para enviar el email de verificación
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`, // Usamos el sender importado
      to: recipient.map(r => r.email).join(', '), // Destinatarios
      subject: 'Verify your email', // Asunto del correo
      html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken), // Plantilla HTML
    };

    const info = await transporter.sendMail(mailOptions); // Enviamos el correo
    console.log('Email sent successfully:', info); // Confirmación de éxito
  } catch (error:any) {
    console.error('Error sending verification email:', error); // Captura de errores
    throw new Error(`Error sending verification email: ${error.message}`); // Envío de error
  }
};

// Función para enviar el email de bienvenida
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`, // Usamos el sender importado
      to: recipient.map(r => r.email).join(', '), // Destinatarios
      subject: 'Welcome to Auth Company!', // Asunto del correo
      html: `<p>Hello ${name},</p><p>Welcome to our service!</p>`, // Contenido del correo HTML
    };

    const info = await transporter.sendMail(mailOptions); // Enviamos el correo
    console.log('Welcome email sent successfully:', info); // Confirmación de éxito
  } catch (error:any) {
    console.error('Error sending welcome email:', error); // Captura de errores
    throw new Error(`Error sending welcome email: ${error.message}`); // Envío de error
  }
};