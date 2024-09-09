import { CookieOptions } from 'express';  // Tipo para las opciones de cookie

export const cookieOptions: CookieOptions = {
  httpOnly: true, // Solo accesible desde el servidor
  secure: process.env.NODE_ENV === 'production', // Solo en producción, en desarrollo debería ser false
  sameSite: 'strict', // Protección contra CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // Expira en 7 días
};